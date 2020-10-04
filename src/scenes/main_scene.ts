import { CONST } from "../const";
import { OrderManager } from "../core/order";
import { GameMap, GroundType, RailType } from "../core/map";
import { Station } from "../objects/station";
import { Player } from "../core/player";
import { Position } from "../utils/position";
import { Direction } from "../utils/direction";
import { ScoreBoard } from "../hud/score_board";
import { Factory, ResourceType } from "../objects/factory";

var assert = require('assert');

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
    private lastKeyDetected: number;

    // Game objects.
    private gameMap: GameMap;
    private stations: Station[];
    private factories: Factory[];
    private orderManager: OrderManager;
    private player: Player;

    // Containers
    private buildingsContainer: Phaser.GameObjects.Container;

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

        // Background
        this.load.image('gameBackground', 'karta1.png');

        // Resources
        this.load.image('order_box', 'order_box.png');
        this.load.image('resource_food', 'resource_food.png');
        this.load.image('resource_oxygen', 'resource_oxygen.png');
        this.load.image('resource_water', 'resource_water.png');
        this.load.image('resource_steel', 'resource_steel.png');
        this.load.image('resource_medicine', 'resource_medicine.png');

        // Objects
        this.load.image('orderSource', 'orderSource.png');
        this.load.image('orderSink', 'orderSink.png');
        this.load.image('grass_tile', 'grass.png');
        this.load.image('sand_tile', 'sand.png');
        this.load.image('station_tile', 'station.png');
        this.load.image('factory_tile', 'original/factory.png');
        this.load.image('dialog', 'dialog.png');

        // Rails
        this.load.image('rails_top_bottom', 'rails_top_bottom.png');
        this.load.image('rails_top_right', 'rails_top_right.png');

        // Tram
        this.load.image('tram_carriage_horizontal', 'tram_carriage_horizontal.png');
        this.load.image('tram_carriage_vertical', 'tram_carriage_vertical.png');
        this.load.image('tram_head_horizontal', 'tram_head_horizontal.png');
        this.load.image('tram_head_vertical', 'tram_head_vertical.png');

        // A useful image to draw squares.
        this.load.image('blank', 'blank.png');

        this.load.image('tiles', 'spritesheet.png');
        // this.load.atlas("tiles", "./assets/pack/spritesheet.png", "./assets/pack/spritesheet.json");

        this.load.tilemapTiledJSON('level', 'big_map.json');
    }


    // Initializes game state.
    init(): void {
        this.takeOrderKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.msSinceLastTick = 0;
        this.tickCounter = 0;
        this.stations = [];
        this.factories = [];
        this.lastKeyDetected = 0;
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

        this.buildingsContainer = new Phaser.GameObjects.Container(this, 0, 0);

        // Map
        this.gameMap = new GameMap(this, 0, 0);
        this.add.existing(this.gameMap);
        this.generateMap();

        let loc = this.findFirstRail();
        this.player = new Player(this, this.gameMap, loc, Direction.Right);
        this.add.existing(this.player);

        this.add.existing(this.buildingsContainer);

        this.orderManager = new OrderManager(this, this.stations);
        this.scoreBoard = new ScoreBoard(this, 10, 10);
        this.add.existing(this.scoreBoard);

        // this.debugVisualizeNearTiles();

        // this.cameras.main.startFollow(this.player);
        // this.cameras.main.setZoom(10);
    }

    findFirstRail(): Position {
        let best_priority = 1000;
        let bestX = -1;
        let bestY = -1;
        for (let x = 0; x < CONST.mapWidth; ++x) {
            for (let y = 0; y < CONST.mapHeight; ++y) {
                if (!!this.gameMap.getRailType(x, y)) {
                    let priority = x + y;
                    if (priority < best_priority) {
                        best_priority = priority;
                        bestX = x;
                        bestY = y;
                    }
                }
            }
        }
        return new Position(bestX, bestY);
    }

    generateMap(): void {
        // Reset station counter in case it's not our first game.
        Station.station_count = 0;

        this.backgroundLayer = this.tilemap.createStaticLayer("Rails", this.tileset, 0, 0);
        this.backgroundLayer.setVisible(false);
        let tiles = this.backgroundLayer.tilemap.layers[0].data;
        let typeToRailType = {'UpLeft': RailType.UpLeft, 'UpRight': RailType.UpRight, 'DownLeft': RailType.DownLeft, 'DownRight': RailType.DownRight, 'Vertical': RailType.Vertical, 'Horizontal': RailType.Horizontal};

        console.log(tiles[0]);
        for (let x = 0; x < 30; ++x) {
            for (let y = 0; y < tiles.length; ++y) {
                let type = tiles[y][x].properties.type;
                if (type == 'Station') {
                    this.addStation(x, y, '0');
                } else {
                    this.gameMap.updateRail(x, y, typeToRailType[type]);
                }
            }
        }

        // Add factories (they are objects instead of tiles because that allows to add custom properties to each factory).
        let typeToResourceType = {'Steel': ResourceType.Steel, 'Food': ResourceType.Food, 'Oxygen': ResourceType.Oxygen, 'Water': ResourceType.Water, 'Medicine': ResourceType.Medicine};
        this.backgroundLayer.tilemap.objects[0].objects.forEach(object => {
            console.log(object)
            // TODO: why -1?
            this.addFactory(Math.round(object.x / 32), Math.round(object.y / 32) - 1, typeToResourceType[object.properties[0].value]);
        });

        // for (let station of this.stations) {
        //     this.gameMap.generatePlatform(station.column, station.row);
        // }
        for (let factory of this.factories) {
            this.gameMap.generatePlatform(factory.column, factory.row);
        }
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
        this.buildingsContainer.add(station);
    }

    addFactory(x: integer, y: integer, resourceType: ResourceType): void {
        let factory = new Factory(this, {
            x: x * CONST.tileSize,
            y: y * CONST.tileSize,
            column: x,
            row: y,
            resourceType: resourceType,
        });
        this.factories.push(factory);
        this.buildingsContainer.add(factory);
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        this.player.update(delta, this.findNearestStation()[1]);

        let nearbyStation = this.findNearbyStation();
        if (nearbyStation) {
            let numFulfilled = this.orderManager.fulfilDemandInStation(nearbyStation);
            this.scoreBoard.increaseScore(numFulfilled);
        }
        let isReady = (time - this.lastKeyDetected) > CONST.minMsBetweenClicks;
        if (this.takeOrderKey.isDown && isReady) {
            this.lastKeyDetected = time;
            let nearbyFactory = this.findNearbyFactory();
            if (nearbyFactory) {
                if (this.orderManager.resourcesInInventory.length >= CONST.inventorySize) {
                    console.log('Inventory is full!');
                } else {
                    this.orderManager.pickResource(nearbyFactory);
                }
            }
        }

        {
            for (let factory of this.factories) {
                factory.setHighlighted(false);
            }
            let nearbyFactory = this.findNearbyFactory();
            if (nearbyFactory) {
                nearbyFactory.setHighlighted(true);
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
            let loc = this.player.getTileCoordinates();
            if (station.isNearby(loc[0], loc[1])) {
                nearbyStations.push(station);
            }
        });
        assert(nearbyStations.length <= 1);
        if (nearbyStations.length == 1) {
            return nearbyStations[0];
        }
    }

    findNearestStation(): [Station, number] {
        let nearestStation: Station = null;
        let nearestDistance: number = 1e6;
        for (let station of this.stations) {
            let distance = Phaser.Math.Distance.Between(station.x, station.y, this.player.x, this.player.y);
            if (distance < nearestDistance) {
                nearestStation = station;
                nearestDistance = distance;
            }
        }
        return [nearestStation, nearestDistance];
    }

    findNearbyFactory(): Factory {
        var nearbyFactories = [];
        this.factories.forEach(factory => {
            let loc = this.player.getTileCoordinates();
            if (factory.isNearby(loc[0], loc[1])) {
                nearbyFactories.push(factory);
            }
        });
        assert(nearbyFactories.length <= 1);
        if (nearbyFactories.length == 1) {
            return nearbyFactories[0];
        }
    }

    // Called every tickDelta ticks to update game state.
    updateStep(): void {
        if ((this.tickCounter % Math.max(CONST.addOrderFrequency - 4 * this.scoreBoard.score, 10)) == 1) {
            if (!this.orderManager.addDemand()) {
                console.log('You\'re dead!')
                this.scene.start("EndScene", { score: this.scoreBoard.score});
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
