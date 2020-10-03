import { CONST } from "../const";
import { Order } from "../core/order";
import { GroundType, Map } from "../core/map";
import { randomInt } from "../utils/math";

export class MainScene extends Phaser.Scene {
    private backgroundSprite: Phaser.GameObjects.Sprite;
    private helloWorldText: Phaser.GameObjects.Text;
    private msSinceLastTick: number;
    private tickCounter: integer;
    private orders: Order[];
    private orderSources: Phaser.GameObjects.Image[];
    private orderSinks: Phaser.GameObjects.Image[];
    private takeOrderKey: Phaser.Input.Keyboard.Key;
    private map: Map;
    private stationLocations: Array<Array<integer>>;
    private usedSourceStationIds: Array<integer>;

    constructor() {
        super({
            key: "MainScene"
        });
    }


    // Preloads game resources.
    preload(): void {
        this.load.image("gameBackground", "./assets/karta.png");
        this.load.image("orderSource", "./assets/orderSource.png");
        this.load.image("orderSink", "./assets/orderSink.png");
        this.load.image('grass_tile', "./assets/grass.png");
        this.load.image('sand_tile', "./assets/sand.png");
        this.load.image('station_tile', "./assets/station.png");
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
        this.helloWorldText = this.add.text(
            gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
        )

        // Map
        this.map = new Map(this, 0, 0);
        this.generateMap();

        this.stationLocations = [];
        for (let x = 0; x < CONST.mapWidth; ++x) {
            for (let y = 0; y < CONST.mapHeight; ++y) {
              if (this.map.getGroundType(x, y) == GroundType.Station) {
                let station = [x, y];
                this.stationLocations.push(station);
              }
            } 
        }
        this.usedSourceStationIds = [];
    }

    generateMap(): void {
        // Add stations.
        this.map.updateGroundType(3, 3, GroundType.Station);
        this.map.updateGroundType(3, 6, GroundType.Station);
        this.map.updateGroundType(6, 3, GroundType.Station);
        this.map.updateGroundType(6, 6, GroundType.Station);
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        if (this.takeOrderKey.isDown) {
            // TODO: Take order if possible.
            console.log("Space pressed.");
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
            this.addOrder();
        }
        this.helloWorldText.setText("Hello, wor!" + String(this.tickCounter));
    }

    // Create a new order.
    addOrder(): void {
        console.log('hi', this.orders.length, this.stationLocations.length);
        if (this.orders.length < this.stationLocations.length) {
            let beginStation = randomInt(this.stationLocations.length);
            while (this.usedSourceStationIds.indexOf(beginStation) > -1) {
              // Make sure source is not already used by some other order.
              beginStation = randomInt(this.stationLocations.length);
            }
            this.usedSourceStationIds.push(beginStation);
            let endStation = randomInt(this.stationLocations.length);
            while (beginStation == endStation) {
              // Make sure source end sink are distinct.
              endStation = randomInt(this.stationLocations.length);
            }
            let source = this.stationLocations[beginStation];
            let sink = this.stationLocations[endStation];
            var order = new Order(source[0] * CONST.tileSize, source[1] * CONST.tileSize, sink[0] * CONST.tileSize, sink[1] * CONST.tileSize);
            this.orders.push(order);
            let orderId = this.orders.length;
            this.add.text(order.startPosX - 20, order.startPosY - 20, String(orderId))
            var orderSource = new Phaser.GameObjects.Image(this, order.startPosX, order.startPosY, 'orderSource');
            orderSource.setScale(0.3, 0.3);
            var orderSink = new Phaser.GameObjects.Image(this, order.endPosX, order.endPosY, 'orderSink');
            this.add.text(order.endPosX - 20, order.endPosY - 20, String(orderId))
            orderSink.setScale(0.1, 0.1);
            this.add.existing(orderSource);
            this.add.existing(orderSink);
            this.orderSources.push(orderSource);
            this.orderSinks.push(orderSink);
        }
    }
}
