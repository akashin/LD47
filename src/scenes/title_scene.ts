import { CONST } from "../const";
import { Order } from "../core/order";

export class TitleScene extends Phaser.Scene {
  private backgroundSprite: Phaser.GameObjects.Sprite;
  private startKey: Phaser.Input.Keyboard.Key;
  private gameNameText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "TitleScene"
    });
  }

  // Preloads game resources.
  preload(): void {
    this.load.image("titleBackground", "./assets/bckgrnd_7.png");
  }

  // Initializes game state.
  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  // Creates game objects.
  create(): void {
    var gameWidth = this.game.config.width as number;
    var gameHeight = this.game.config.height as number;

    // Draw background image.
    {
      this.backgroundSprite = this.add.sprite(0, 0, "titleBackground");
      this.backgroundSprite.setOrigin(0, 0);
      let ratio = this.backgroundSprite.width / this.backgroundSprite.height;
      this.backgroundSprite.setScale(
        gameWidth / this.backgroundSprite.height,
        gameHeight / this.backgroundSprite.height,
      );
    }

    this.gameNameText = this.add.text(
      gameWidth / 2 - 50, gameHeight / 2 - 20, "Awesome Game Name"
    )
  }

  // Called periodically to update game state.
  update(time: number, delta: number): void {
    if (this.startKey.isDown) {
      this.scene.start("MainScene");
    }
  }
}
