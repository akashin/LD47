import { CONST } from "../const";
import { Order } from "../core/order";

export class MainScene extends Phaser.Scene {
  private backgroundSprite: Phaser.GameObjects.Sprite;
  private helloWorldText: Phaser.GameObjects.Text;
  private msSinceLastTick: number;
  private tickCounter: integer;
  private orders: Order[];
  private orderSources: Phaser.GameObjects.Image[];
  private orderSinks: Phaser.GameObjects.Image[];
  private takeOrderKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  // Preloads game resources.
  preload(): void {
    this.load.image("gameBackground", "./assets/bckgrnd_2.png");
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

    this.add.sprite(0, 0, 'grass_tile');

    this.orders = [];
    this.orderSources = [];
    this.orderSinks = [];
    this.helloWorldText = this.add.text(
      gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
    )
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
    console.log(this.tickCounter);
    if ((this.tickCounter % 30) == 1) {
      this.addOrder();
    }
    this.helloWorldText.setText("Hello, wor!" + String(this.tickCounter));
  }

  // Create a new order.
  addOrder(): void {
    var order = new Order(CONST.mapWidth * CONST.tileSize, CONST.mapHeight * CONST.tileSize);
    this.orders.push(order);
    var orderSource = new Phaser.GameObjects.Image(this, order.startPosX, order.startPosY, 'orderSource');
    orderSource.setScale(0.3, 0.3);
    var orderSink = new Phaser.GameObjects.Image(this, order.endPosX, order.endPosY, 'orderSink');
    orderSink.setScale(0.1, 0.1);
    this.add.existing(orderSource);
    this.add.existing(orderSink);
    this.orderSources.push(orderSource);
    this.orderSources.push(orderSink);
  }
}
