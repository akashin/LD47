import { CONST } from "../const";
import { GameMap, GroundType, RailType } from "../core/map";
import { Station } from "../objects/station";
import { Player } from "../core/player";
import { Position } from "../utils/position";
import { Direction } from "../utils/direction";
import { ScoreBoard } from "../hud/score_board";
import { Factory, ResourceType } from "../objects/factory";
import { randomInt } from "../utils/math";
import { Inventory } from "../hud/inventory";
import { Tutorial } from "../hud/tutorial";
import { Raiting } from "../hud/rating";

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
    private takeResourceKey: Phaser.Input.Keyboard.Key;
    private muteKey: Phaser.Input.Keyboard.Key;
    // True if in the previous update() call user was pressing space AND was near a factory.
    private prevUpdateClickedAndStation: boolean;

    // Game time.
    private msSinceLastTick: number;
    private tickCounter: integer;

    // Game objects.
    private gameMap: GameMap;
    private stations: Station[];
    private factories: Factory[];
    private player: Player;
    public demandCount: number; // UGLY that I have to make it public, but because of tutorial. TODO.
    private demandOverflowTicks: number;
    private resourceInventory: Inventory;
    private raiting: Raiting;

    // Logic.
    private muted: boolean;
    private isPaused: boolean;

    // Tutorial.
    private tutorial: Tutorial;
    private tutorialInProgress: boolean;


    // Containers
    private buildingsContainer: Phaser.GameObjects.Container;

    // Visual elements.
    private scoreBoard: ScoreBoard;

    private backgroundMusic: Phaser.Sound.BaseSound;
    private resourcePickup: Phaser.Sound.BaseSound;
    private resourceDelivery: Phaser.Sound.BaseSound;

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
        this.load.image('resource_food', 'resource_food.png');
        this.load.image('resource_oxygen', 'resource_oxygen.png');
        this.load.image('resource_water', 'resource_water.png');
        this.load.image('resource_steel', 'resource_steel.png');
        this.load.image('resource_medicine', 'resource_medicine.png');

        // Objects
        this.load.image('grass_tile', 'grass.png');
        this.load.image('sand_tile', 'sand.png');
        this.load.image('platform_tile', 'platform_tile.png');
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

        // Decorations.
        this.load.image('krater1', 'krater1.png');
        this.load.image('krater2', 'krater2.png');
        this.load.image('krater3', 'krater3.png');
        this.load.image('raketa1', 'raketa1.png');
        this.load.image('raketa2', 'raketa2.png');
        this.load.image('gorka', 'gorka.png');
        this.load.image('truba1', 'truba1.png');
        this.load.image('truba2', 'truba2.png');

        // Inventory.
        this.load.image('inventory_end', 'inventar_1.png');
        this.load.image('inventory_body', 'inventar_2.png');

        // Rating
        this.load.image('star_empty', 'star_empty.png');
        this.load.image('star_half', 'star_half.png');
        this.load.image('star_full', 'star_full.png');

        // A useful image to draw squares.
        this.load.image('blank', 'blank.png');

        this.load.image('tiles', 'spritesheet.png');
        // this.load.atlas("tiles", "./assets/pack/spritesheet.png", "./assets/pack/spritesheet.json");

        this.load.tilemapTiledJSON('level', 'big_map.json');

        this.load.audio("background_track", "background.mp3");

        // Sounds.
        this.load.audio("resource_pickup", "resource_pickup.wav");
        this.load.audio("resource_delivery", "resource_delivery.wav");
    }


    // Initializes game state.
    init(data): void {
        this.takeResourceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.muteKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.M
        );
        this.muted = false;
        if (data.muted) {
            this.muted = true;
        }
        // If restarting the game, data.tutorial is not provided (undefined).
        if (data.tutorial) {
            this.tutorialInProgress = true;
        } else {
            this.tutorialInProgress = false;
        }
        this.isPaused = false;
        this.msSinceLastTick = 0;
        this.tickCounter = 0;
        this.stations = [];
        this.factories = [];
        // Init with true so that if the user lost and then clicked to restart the game,
        // this first clicked didn't count as taking resource from the first factory.
        this.prevUpdateClickedAndStation = true;
        this.demandCount = 0;
        this.demandOverflowTicks = 0;
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

        // Help.
        this.add.text(0.8 * gameWidth, 0.92 * gameHeight, 'Press M to mute');

        // Map
        this.gameMap = new GameMap(this, 0, 0);
        this.add.existing(this.gameMap);
        this.generateMap();

        let loc = this.findFirstRail();
        this.player = new Player(this, this.gameMap, loc, Direction.Right);
        this.add.existing(this.player);

        this.add.existing(this.buildingsContainer);

        this.resourceInventory = new Inventory(this, CONST.inventoryX, CONST.inventoryY);
        this.add.existing(this.resourceInventory);
        this.scoreBoard = new ScoreBoard(this, 5, 5);
        this.add.existing(this.scoreBoard);

        this.backgroundMusic = this.sound.add("background_track", {
            loop: true,
        });
        if (!this.muted) {
            this.backgroundMusic.play({volume: 0.1});
        }

        this.resourcePickup = this.sound.add("resource_pickup");
        this.resourceDelivery = this.sound.add("resource_delivery");
        // Tutorial.
        this.tutorial = new Tutorial(this, this.stations[2]);

        this.raiting = new Raiting(this, 130, 5);
        this.add.existing(this.raiting);

        // this.debugVisualizeNearTiles();

        // this.cameras.main.startFollow(this.player);@
        // this.cameras.main.setZoom(10);
    }

    findFirstRail(): Position {
        let bestPriority = 1000;
        let bestX = -1;
        let bestY = -1;
        for (let x = 0; x < CONST.mapWidth; ++x) {
            for (let y = 0; y < CONST.mapHeight; ++y) {
                if (!!this.gameMap.getRailType(x, y)) {
                    let priority = x + y;
                    if (priority < bestPriority) {
                        bestPriority = priority;
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
        Station.stationCount = 0;

        this.backgroundLayer = this.tilemap.createStaticLayer("Rails", this.tileset, 0, 0);
        this.backgroundLayer.setVisible(false);
        let tiles = this.backgroundLayer.tilemap.layers[0].data;
        let typeToRailType = {'UpLeft': RailType.UpLeft, 'UpRight': RailType.UpRight, 'DownLeft': RailType.DownLeft, 'DownRight': RailType.DownRight, 'Vertical': RailType.Vertical, 'Horizontal': RailType.Horizontal};

        console.log(tiles[0]);
        for (let x = 0; x < 30; ++x) {
            for (let y = 0; y < tiles.length; ++y) {
                let type = tiles[y][x].properties.type;
                if (type == 'Station') {
                    this.addStation(x, y);
                } else {
                    this.gameMap.updateRail(x, y, typeToRailType[type]);
                }
            }
        }

        // Add factories (they are objects instead of tiles because that allows to add custom properties to each factory).
        let typeToResourceType = {'Steel': ResourceType.Steel, 'Food': ResourceType.Food, 'Oxygen': ResourceType.Oxygen, 'Water': ResourceType.Water, 'Medicine': ResourceType.Medicine};
        this.tilemap.getObjectLayer('Buildings').objects.forEach(object => {
            // TODO: why -1?
            this.addFactory(Math.round(object.x / 32), Math.round(object.y / 32) - 1, typeToResourceType[object.properties[0].value]);
        });

        this.tilemap.getObjectLayer('Decorations').objects.forEach(object => {
            if (object.properties == null) {
                console.log('Bad object:', object.properties);
            } else {
                let decorationName = object.properties[0].value;
                let sprite = this.add.sprite(object.x / 32 * CONST.tileSize, (object.y / 32 - 1) * CONST.tileSize, decorationName);
                sprite.setOrigin(0, 0);
                sprite.setDisplaySize(object.width / 32 * CONST.tileSize, object.height / 32 * CONST.tileSize);
            }
        });

        for (let factory of this.factories) {
            this.gameMap.generatePlatform(factory.column, factory.row);
        }
    }

    addStation(x: integer, y: integer): void {
        let station = new Station(this, {
            x: x * CONST.tileSize,
            y: y * CONST.tileSize,
            column: x,
            row: y,
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
        if (this.isPaused) {
            if (this.takeResourceKey.isDown || this.input.activePointer.isDown) {
                this.isPaused = false;
            }
            return
        }

        {
            let score = this.scoreBoard.score;
            let speedBoost = Math.min(Math.pow(score, 1.1), 20);
            this.player.update(delta, this.findNearestFactory()[1], CONST.trainMaxSpeed * (1 + speedBoost / 10));
        }

        {
            let allHasDemand = true;
            for (let station of this.stations) {
                if (!station.hasDemand()) {
                    allHasDemand = false;
                    break;
                }
            }
            if (allHasDemand) {
                // this.raiting.decreaseRating(delta);
            }
        }

        let nearbyStation = this.findNearbyStation();
        if (nearbyStation) {
            let numFulfilled = this.fulfilDemandInStation(nearbyStation);
            this.scoreBoard.increaseScore(numFulfilled);
            this.raiting.increaseReatingOnDelivery(numFulfilled);
        }
        if (this.takeResourceKey.isDown || this.input.activePointer.isDown) {
            let nearbyFactory = this.findNearbyFactory();
            if (nearbyFactory) {
                if (this.resourceInventory.getResources().length >= CONST.inventorySize) {
                    console.log('Inventory is full!');
                } else if (!this.prevUpdateClickedAndStation){
                    if (!this.muted) {
                        this.resourcePickup.play();
                    }
                    this.resourceInventory.addResource(nearbyFactory.resourceType);
                }
                this.prevUpdateClickedAndStation = true;
            } else {
                this.prevUpdateClickedAndStation = false;
            }
        } else {
            this.prevUpdateClickedAndStation = false
        }

        if (this.muteKey.isDown) {
            this.backgroundMusic.pause();
            this.muted = true;
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

        this.raiting.update(delta);
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

    findNearestFactory(): [Factory, number] {
        let nearestFactory: Factory = null;
        let nearestDistance: number = 1e6;
        for (let factory of this.factories) {
            let distance = Phaser.Math.Distance.Between(factory.x, factory.y, this.player.x, this.player.y);
            if (distance < nearestDistance) {
                nearestFactory = factory;
                nearestDistance = distance;
            }
        }
        return [nearestFactory, nearestDistance];
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

    pause(): void {
        this.isPaused = true;
    }

    // Called every tickDelta ticks to update game state.
    updateStep(): void {
        if (this.tutorialInProgress) {
            let tutorialFinished = this.tutorial.updateStep(this, this.player.x, this.player.y);
            if (tutorialFinished) {
                this.tutorialInProgress = false;
            }
            return
        }

        let demandPeriod = Math.max(
            CONST.baseDemandPeriod - CONST.scoreSpeedupMultiplier * this.scoreBoard.score,
            CONST.minDemandPeriod);
        if ((this.tickCounter % demandPeriod) == 1) {
            this.addDemand(this.tickCounter);
            // if (!this.addDemand(this.tickCounter)) {
            //     this.demandOverflowTicks += 1;
            //     if (this.demandOverflowTicks > CONST.endGameThreshold) {
            //         console.log('You\'re dead!')
            //         this.backgroundMusic.stop();
            //         this.scene.start("EndScene", {score: this.scoreBoard.score, muted: this.muted});
            //     }
            // } else {
            //     this.demandOverflowTicks = 0;
            // }
        }

        if (this.raiting.isZero()) {
            console.log('You\'re dead!')
            this.backgroundMusic.stop();
            this.scene.start("EndScene", {score: this.scoreBoard.score, muted: this.muted});
        }

        for (let station of this.stations) {
            if (station.hasDemand()) {
                station.update(this.tickCounter);
                if (station.isDemandExpired()) {
                    station.removeDemand();
                    this.raiting.decreaseRatingOnExpiration();
                    --this.demandCount;
                }
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

    addDemand(timeNow: number): boolean {
        let numStations = this.stations.length;
        // No more space to create demands.
        if (this.demandCount >= numStations) {
            return false;
        }

        let stationIndex = randomInt(numStations);
        // Make sure station does not already have a demand.
        while (this.stations[stationIndex].hasDemand()) {
            stationIndex = randomInt(numStations);
        }
        assert(this.stations[stationIndex].index == stationIndex);

        if (this.demandCount == CONST.resourceCount) {
            return false;
        }
        let resourceType: ResourceType = null;
        while (resourceType == null) {
            resourceType = randomInt(CONST.resourceCount);

            for (let station of this.stations) {
                if (station.hasDemand() && station.getDemand().resourceType == resourceType) {
                    resourceType = null;
                    break;
                }
            }
        }
        assert(resourceType != null);

        this.stations[stationIndex].setDemand(resourceType, timeNow, this.scoreBoard.score);
        this.demandCount += 1;

        return true;
    }

    fulfilDemandInStation(station: Station): number {
        let resources = this.resourceInventory.getResources();
        for (let i = 0; i < resources.length; ++i) {
            if (station.tryFulfilDemand(resources[i])) {
                console.log('Fulfilled demand at station', station.index, 'and resource', resources[i]);
                this.resourceInventory.removeResource(i);
                this.demandCount -= 1;
                if (!this.muted) {
                    this.resourceDelivery.play();
                }
                return 1;
            }
        }
        return 0;
    }
}
