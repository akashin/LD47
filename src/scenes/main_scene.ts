import { CONST } from "../const";
import { Order, OrderManager } from "../core/order";
import { GameMap, GroundType, RailType } from "../core/map";
import { Station } from "../objects/station";
import { Player } from "../core/player";
import { Position } from "../utils/position";
import { Direction } from "../utils/direction";

export class MainScene extends Phaser.Scene {
    // Graphics.
    private backgroundSprite: Phaser.GameObjects.Sprite;
    // Holds data about the actual map.
    private tilemap: Phaser.Tilemaps.Tilemap;
    // Stores tiles images.
    private tileset: Phaser.Tilemaps.Tileset;
    private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

    // Inputs.
    private takeOrderKey: Phaser.Input.Keyboard.Key;

    // Game time.
    private msSinceLastTick: number;
    private tickCounter: integer;

    // Game objects.
    private gameMap: GameMap;
    private stations: Station[];
    private orderManager: OrderManager;
    private player: Player;

    constructor() {
        super({
            key: "MainScene"
        });
    }

    // Preloads game resources.
    preload(): void {

        this.load.setPath('./assets/');
        this.load.image("gameBackground", "karta1.png");
        this.load.image("orderSource", "orderSource.png");
        this.load.image("orderSink", "orderSink.png");
        this.load.image('grass_tile', "grass.png");
        this.load.image('sand_tile', "sand.png");
        this.load.image('station_tile', "station.png");
        // Rails
        this.load.image('rails_top_bottom', "rails_top_bottom.png");
        this.load.image('rails_top_right', "rails_top_right.png");
        // A useful image to draw squares.
        this.load.image("blank", "blank.png");

        this.load.image("tiles", "spritesheet.png");
        // this.load.atlas("tiles", "./assets/pack/spritesheet.png", "./assets/pack/spritesheet.json");
        this.load.tilemapTiledJSON("level", "maps/small_map.json");
    }


    // Initializes game state.
    init(): void {
        this.takeOrderKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.msSinceLastTick = 0;
        this.tickCounter = 0;
        this.stations = [];
    }

    // Creates game objects.
    create(): void {
        var gameWidth = this.game.config.width as number;
        var gameHeight = this.game.config.height as number;

        // Draw background image.
        {
            this.backgroundSprite = this.add.sprite(0, 0, "gameBackground");
            this.backgroundSprite.setOrigin(0, 0);
            let ratio = this.backgroundSprite.width / this.backgroundSprite.height;
            this.backgroundSprite.setScale(
                gameWidth / this.backgroundSprite.height,
                gameHeight / this.backgroundSprite.height,
            );
        }

        // this.tilemap = this.make.tilemap({ key: "level" });
        // this.tileset = this.tilemap.addTilesetImage("tiles_64px", "tiles", 64, 64);

        // this.backgroundLayer = this.tilemap.createStaticLayer("Rails", this.tileset, 0, 0);

        // Map
        this.gameMap = new GameMap(this, 0, 0);
        this.add.existing(this.gameMap);
        this.generateMap();

        this.player = new Player(this, this.gameMap, new Position(5, 4), Direction.Right);
        this.add.existing(this.player);

        this.orderManager = new OrderManager(this, this.stations);

        this.debugVisualizeNearTiles();
    }

    generateMap(): void {
        // Add rails
        this.gameMap.updateRail(4, 4, RailType.DownRight);
        this.gameMap.updateRail(5, 4, RailType.Horizontal);
        this.gameMap.updateRail(6, 4, RailType.DownLeft);
        this.gameMap.updateRail(6, 5, RailType.Vertical);
        this.gameMap.updateRail(6, 6, RailType.UpLeft);
        this.gameMap.updateRail(5, 6, RailType.Horizontal);
        this.gameMap.updateRail(4, 6, RailType.UpRight);
        this.gameMap.updateRail(4, 5, RailType.Vertical);

        // Change ground
        this.gameMap.updateGround(5, 5, GroundType.Grass);

        // Add stations.
        this.addStation(3, 3);
        this.addStation(3, 6);
        this.addStation(6, 3);
        this.addStation(6, 6);
    }

    addStation(x: integer, y: integer): void {
        let station = new Station(this, {
            x: x * CONST.tileSize,
            y: y * CONST.tileSize,
            column: x,
            row: y,
        });
        this.stations.push(station);
        this.add.existing(station);
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        this.player.update(delta);

        let nearbyStation = this.findNearbyStation();
        if (nearbyStation) {
            this.orderManager.fulfilOrdersInStations(nearbyStation);

            if (this.takeOrderKey.isDown) {
                let order = this.orderManager.stationSourceOrder[nearbyStation.index];
                if (order) {
                    if (this.orderManager.ordersInInventory.length < CONST.inventorySize) {
                        this.orderManager.pickOrder(order);
                    } else {
                        console.log('Inventory is too full!');
                    }
                } else {
                    console.log('No order');
                }
            }
        }
        this.msSinceLastTick += delta;
        while (this.msSinceLastTick >= CONST.tickDelta) {
            this.msSinceLastTick -= CONST.tickDelta;
            this.tickCounter += 1;
            this.updateStep();
        }
    }

    findNearbyStation(): Station {
        var nearbyStations = [];
        this.stations.forEach(station => {
            // TODO: Figure out whether we need to do comparison in L2 space.
            if (station.isNearby(this.player.x / CONST.tileSize, this.player.y / CONST.tileSize)) {
                nearbyStations.push(station);
            }
        });
        var assert = require('assert');
        assert(nearbyStations.length <= 1);
        if (nearbyStations.length == 1) {
            return nearbyStations[0];
        }
    }

    // Called every tickDelta ticks to update game state.
    updateStep(): void {
        if ((this.tickCounter % CONST.addOrderFrequency) == 1) {
            if (!this.orderManager.addOrder()) {
                console.log('You\'re dead!')
                this.scene.start("EndScene");
            }
        }
    }

    // Visualize station coverege for deubgging.
    debugVisualizeNearTiles(): void {
        for (let x = 0; x < CONST.mapWidth; ++x) {
            for (let y = 0; y < CONST.mapHeight; ++y) {
                var nearbyStations = [];
                this.stations.forEach(station => {
                    if (station.isNearby(x, y)) {
                        nearbyStations.push(station);
                    }
                });
                if (nearbyStations.length == 1) {
                    let sptite = new Phaser.GameObjects.Sprite(this, x * CONST.tileSize, y * CONST.tileSize, 'blank');
                    sptite.setOrigin(0, 0);
                    sptite.setDisplaySize(CONST.tileSize, CONST.tileSize);
                    sptite.setTint(0xff0000);
                    sptite.setAlpha(0.4)
                    this.add.existing(sptite);
                } else if (nearbyStations.length > 1) {
                    alert('Tile ' + String(x) + ', ' + String(y) + ' is nearest to two tiles!');
                }
            }
        }
    }
}
