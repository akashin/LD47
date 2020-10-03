import { CONST } from "../const";
import { Order, OrderManager } from "../core/order";
import { GameMap, GroundType, RailType } from "../core/map";
import { randomInt } from "../utils/math";
import { Station } from "../objects/station";
import { PlayerState } from "../core/player_state";

export class MainScene extends Phaser.Scene {
    private backgroundSprite: Phaser.GameObjects.Sprite;
    private msSinceLastTick: number;
    private tickCounter: integer;
    private orders: Order[];
    private orderSources: Phaser.GameObjects.Image[];
    private orderSinks: Phaser.GameObjects.Image[];
    private takeOrderKey: Phaser.Input.Keyboard.Key;
    private map: GameMap;
    private stationLocations: Array<Array<integer>>;
    private usedSourceStationIds: Array<integer>;
    private stations: Station[];
    private orderManager: OrderManager;
    private playerState: PlayerState;

    private tmpStationIdx: number;
    private tmpPositionText: Phaser.GameObjects.Text;

    // Holds data about the actual map.
    private tilemap: Phaser.Tilemaps.Tilemap;
    // Stores tiles images.
    private tileset: Phaser.Tilemaps.Tileset;
    private backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

    constructor() {
        super({
            key: "MainScene"
        });
    }


    // Preloads game resources.
    preload(): void {
        this.load.image("gameBackground", "./assets/karta1.png");
        this.load.image("orderSource", "./assets/orderSource.png");
        this.load.image("orderSink", "./assets/orderSink.png");
        this.load.image('grass_tile', "./assets/grass.png");
        this.load.image('sand_tile', "./assets/sand.png");
        this.load.image('station_tile', "./assets/station.png");
        // Rails
        this.load.image('rails_top_bottom', "./assets/rails_top_bottom.png");
        this.load.image('rails_top_right', "./assets/rails_top_right.png");
        // A useful image to draw squares.
        this.load.image("blank", "./assets/blank.png");

        // this.load.image("tiles", "all_tiles.png");
        this.load.tilemapTiledJSON("level", "./assets/maps/small_map.json");
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

        this.playerState = new PlayerState();

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

        this.orders = [];
        this.orderSources = [];
        this.orderSinks = [];

        // this.tilemap = this.make.tilemap({ key: "level" });
        // this.tileset = this.tilemap.addTilesetImage("_bloodnight", "tiles");

        // this.backgroundLayer = this.tilemap.createStaticLayer("Background", this.tileset, 0, 0);

        // Map
        this.map = new GameMap(this, 0, 0);
        this.add.existing(this.map);
        this.generateMap();

        this.orderManager = new OrderManager(this, this.stations);

        this.tmpStationIdx = 0;
        this.tmpPositionText = this.add.text(this.playerState.position.x + 30, this.playerState.position.y + 30, '*');
    }

    generateMap(): void {
        // Add rails
        this.map.updateRail(4, 4, RailType.DownRight);
        this.map.updateRail(5, 4, RailType.Horizontal);
        this.map.updateRail(6, 4, RailType.DownLeft);
        this.map.updateRail(6, 5, RailType.Vertical);
        this.map.updateRail(6, 6, RailType.UpLeft);
        this.map.updateRail(5, 6, RailType.Horizontal);
        this.map.updateRail(4, 6, RailType.UpRight);
        this.map.updateRail(4, 5, RailType.Vertical);

        // Change ground
        this.map.updateGround(5, 5, GroundType.Grass);

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
        if (this.takeOrderKey.isDown) {
            let nearbyStation = this.findNearbyStation();
            if (nearbyStation) {
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
            if (station.isNearby(this.playerState.position.x, this.playerState.position.y)) {
              nearbyStations.push(station);
            }
        });
        console.log("Found ", nearbyStations.length, " stations nearby.");
        var assert = require('assert');
        assert(nearbyStations.length <= 1);
        if (nearbyStations.length == 1) {
            return nearbyStations[0];
        }
    }


    fulfulNearbyOrders(): void {
        //TODO
    }

    // Called every N ticks to update game state.
    updateStep(): void {
        if ((this.tickCounter % 30) == 1) {
            if (!this.orderManager.addOrder()) {
                console.log('You\'re dead!')
                // alert('You\'re dead!');
            }
        }
        if ((this.tickCounter % 30) == 1) {
            this.playerState.position.x = this.stations[this.tmpStationIdx].column;
            this.playerState.position.y = this.stations[this.tmpStationIdx].row;
            this.tmpStationIdx = (this.tmpStationIdx + 1) % 4;
            this.tmpPositionText.setPosition(
                this.playerState.position.x * CONST.tileSize,
                this.playerState.position.y * CONST.tileSize
            );
            this.fulfulNearbyOrders();
        }
    }
}
