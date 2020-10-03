import { CONST } from "../const";
import { Order } from "../core/order";

export class MainScene extends Phaser.Scene {
  private helloWorldText: Phaser.GameObjects.Text;
  private msSinceLastTick: number;
  private tickCounter: integer;
  private orders: Order[];
  private orderSources: Phaser.GameObjects.Image[];
  private orderSinks: Phaser.GameObjects.Image[];
  private startKey: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  // Preloads game resources.
  preload(): void {
    this.load.image("orderSource", "../assets/orderSource.png");
    this.load.image("orderSink", "../assets/orderSink.png");
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
    this.orders = [];
    this.orderSources = [];
    this.orderSinks = [];
    this.helloWorldText = this.add.text(
      gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
    )
  }

  // Called periodically to update game state.
  update(time: number, delta: number): void {
    if (this.startKey.isDown) {
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
    if ((this.tickCounter % 10) == 0) {
      this.addOrder();
    }
    this.helloWorldText.setText("Hello, wor!" + String(this.tickCounter));
  }

  // Called every N ticks to update game state.
  addOrder(): void {
    // TODO: change to real map params.
    var mapW = 100;
    var mapH = 100;
    var order = new Order(mapW, mapH);
    this.orders.push(order);
    var orderSource = new Phaser.GameObjects.Image(this, order.startPosX, order.startPosY, 'orderSource');
    var orderSink = new Phaser.GameObjects.Image(this, order.endPosX, order.endPosY, 'orderSink');
    this.add.existing(orderSource);
    this.add.existing(orderSink);
    this.orderSources.push(orderSource);
    this.orderSources.push(orderSink);
  }
}
