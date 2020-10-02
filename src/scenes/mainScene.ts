export class MainScene extends Phaser.Scene {
  private helloWorldText: Phaser.GameObjects.Text;

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
    this.helloWorldText = this.add.text(
      gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
    )
  }

  // Called periodically to update game state.
  update(time: number, delta: number): void {
  }
}
