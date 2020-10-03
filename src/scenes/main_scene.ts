import { CONST } from "../const";
import { Order, OrderManager } from "../core/order";
import { GameMap, GroundType, RailType } from "../core/map";
import { randomInt } from "../utils/math";
import { Station } from "../objects/station";

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

    private tmpStationIdx: number;
    private tmpPositionX: number;
    private tmpPositionY: number;

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

        this.orders = [];
        this.orderSources = [];
        this.orderSinks = [];

        // Map
        this.map = new GameMap(this, 0, 0);
        this.add.existing(this.map);
        this.generateMap();

        this.orderManager = new OrderManager(this, this.stations);

        this.tmpStationIdx = 0;
        this.tmpPositionX = 0;
        this.tmpPositionY = 0;
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
            var nearbyStations = [];
            this.stations.forEach(station => {
                if (station.isNearby(this.tmpPositionX, this.tmpPositionY)) {
                  nearbyStations.push(station);
                }
            });
            console.log("Found ", nearbyStations.length, " stations nearby.");
            var assert = require('assert');
            assert(nearbyStations.length <= 1);

            let order = this.orderManager.stationSourceOrder[nearbyStations[0].index];
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
        this.msSinceLastTick += delta;
        while (this.msSinceLastTick >= CONST.tickDelta) {
            this.msSinceLastTick -= CONST.tickDelta;
            this.tickCounter += 1;
            this.updateStep();
        }
    }

    // Called every N ticks to update game state.
    updateStep(): void {
        if ((this.tickCounter % 30) == 1) {
            if (!this.orderManager.addOrder()) {
                alert('You\'re dead!');
            }
        }
        if ((this.tickCounter % 100) == 1) {
            this.tmpPositionX = this.stations[this.tmpStationIdx].column;
            this.tmpPositionY = this.stations[this.tmpStationIdx].row;
            this.tmpStationIdx = (this.tmpStationIdx + 1) % 4;

        }
    }
}
