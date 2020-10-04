import { CONST } from "../const";
import { Order, OrderManager } from "../core/order";
import { GameMap, GroundType, RailType } from "../core/map";
import { Station } from "../objects/station";
import { Player } from "../core/player";
import { Position } from "../utils/position";
import { Direction } from "../utils/direction";
import { ScoreBoard } from "../hud/score_board";

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

    // Visual elements.
    private scoreBoard: ScoreBoard;

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
        // Tram
        this.load.image('tram_carriage', 'tram_carriage.png');
        this.load.image('tram_head', 'tram_head.png');
        // A useful image to draw squares.
        this.load.image("blank", "blank.png");

        this.load.image("tiles", "spritesheet.png");
        // this.load.atlas("tiles", "./assets/pack/spritesheet.png", "./assets/pack/spritesheet.json");
        this.load.tilemapTiledJSON("level", "small_map.json");
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

        this.tilemap = this.make.tilemap({ key: "level" });
        this.tileset = this.tilemap.addTilesetImage("spritesheet", "tiles");

        // this.backgroundLayer = this.tilemap.createStaticLayer("Rails", this.tileset, 0, 0);

        // Map
        this.gameMap = new GameMap(this, 0, 0);
        this.add.existing(this.gameMap);
        this.generateMap();

        this.player = new Player(this, this.gameMap, new Position(3, 2), Direction.Right);
        this.add.existing(this.player);

        this.orderManager = new OrderManager(this, this.stations);
        this.scoreBoard = new ScoreBoard(this, 10, 10);
        this.add.existing(this.scoreBoard);

        // this.debugVisualizeNearTiles();

        // this.cameras.main.startFollow(this.player);
        // this.cameras.main.setZoom(10);
    }

    generateMap(): void {
        // Add rails
        let x0 = 2;
        let x1 = 25;
        let y0 = 2;
        let y1 = 20;

        for (let x = x0 + 1; x < x1; ++x) {
            this.gameMap.updateRail(x, y0, RailType.Horizontal);
            this.gameMap.updateRail(x, y1, RailType.Horizontal);
        }
        for (let y = y0 + 1; y < y1; ++y) {
            this.gameMap.updateRail(x0, y, RailType.Vertical);
            this.gameMap.updateRail(x1, y, RailType.Vertical);
        }
        this.gameMap.updateRail(x0, y0, RailType.DownRight);
        this.gameMap.updateRail(x1, y0, RailType.DownLeft);
        this.gameMap.updateRail(x1, y1, RailType.UpLeft);
        this.gameMap.updateRail(x0, y1, RailType.UpRight);

        // Change ground
        this.gameMap.updateGround(5, 5, GroundType.Grass);

        // Reset station counter in case it's not our first game.
        Station.station_count = 0;
        // Add stations.
        this.addStation(x0 + 1, y0 + 1, 'A');
        this.addStation(x0 + 1, 8 + 1, 'A 1/4');
        this.addStation(x0 + 1, 12 + 1, 'A 1/2');
        this.addStation(x0 + 1, 16 + 1, 'A 3/4');
        this.addStation(x0 + 1, y1 - 1, 'B');
        this.addStation(5, y1 - 1, 'B 1/4');
        this.addStation(10, y1 - 1, 'B 1/2');
        this.addStation(15, y1 - 1, 'B 3/4');
        this.addStation(x1 - 1, y0 + 1, 'C');
        this.addStation(5, y0 + 1, 'C 1/4');
        this.addStation(10, y0 + 1, 'C 1/2');
        this.addStation(15, y0 + 1, 'C 3/4');
        this.addStation(x1 - 1, y1 - 1, 'D');
        this.addStation(x1 - 1, 8 + 1, 'D 1/4');
        this.addStation(x1 - 1, 12 + 1, 'D 1/2');
        this.addStation(x1 - 1, 16 + 1, 'D 3/4');
    }

    addStation(x: integer, y: integer, station_name: string): void {
        let station = new Station(this, {
            x: x * CONST.tileSize,
            y: y * CONST.tileSize,
            column: x,
            row: y,
            station_name: station_name,
        });
        this.stations.push(station);
        this.add.existing(station);
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        this.player.update(delta);

        let nearbyStation = this.findNearbyStation();
        if (nearbyStation) {
            let numFulfilled = this.orderManager.fulfilOrdersInStations(nearbyStation);
            this.scoreBoard.increaseScore(numFulfilled);

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
            let loc = this.player.getTileCoordinates();
            if (station.isNearby(loc[0], loc[1])) {
                nearbyStations.push(station);
            }
        });
        if (nearbyStations.length == 1) {
            console.log('Near station ' + ['A', 'B', 'C', 'D'][nearbyStations[0].index]);
        }
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
                    sptite.setTint(0x880000);
                    sptite.setAlpha(0.4)
                    this.add.existing(sptite);
                } else if (nearbyStations.length > 1) {
                    let sptite = new Phaser.GameObjects.Sprite(this, x * CONST.tileSize, y * CONST.tileSize, 'blank');
                    sptite.setOrigin(0, 0);
                    sptite.setDisplaySize(CONST.tileSize, CONST.tileSize);
                    sptite.setTint(0xff0000);
                    sptite.setAlpha(0.4)
                    this.add.existing(sptite);
                    // alert('Tile ' + String(x) + ', ' + String(y) + ' is nearest to two tiles!');
                }
            }
        }
    }
}
