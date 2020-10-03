import { CONST } from "../const";

export class MainScene extends Phaser.Scene {
  private helloWorldText: Phaser.GameObjects.Text;
  private msSinceLastTick: integer;
  private tickCounter: integer;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  // Preloads game resources.
  preload(): void {
  }

  // Initializes game state.
  init(): void {
  }

  // Creates game objects.
  create(): void {
    var gameWidth = this.game.config.width as number;
    var gameHeight = this.game.config.height as number;
    this.msSinceLastTick = 0;
    this.tickCounter = 0;
    this.helloWorldText = this.add.text(
      gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
    )

  }

  // Called periodically to update game state.
  update(time: number, delta: number): void {
    this.msSinceLastTick += delta;
    while (this.msSinceLastTick >= CONST['tickLen']) {
      this.tickCounter += 1;
      this.msSinceLastTick -= CONST['tickLen'];
      this.updateStep();
    }
  }

  // Called every N ticks to update game state.
  updateStep(): void {
    this.helloWorldText.setText("Hello, wor!" + String(this.tickCounter));
  }
}
