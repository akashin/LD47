import { CONST } from "../const";
import { randomInt } from "../utils/math";

export class EndScene extends Phaser.Scene {
    private backgroundSprite: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;
    private gameNameText: Phaser.GameObjects.Text;
    private score: number;
    private muted: boolean;

    constructor() {
        super({
            key: "EndScene"
        });
    }

    // Preloads game resources.
    preload(): void {
        this.load.image("endBackground", "./assets/final_title.png");
    }

    // Initializes game state.
    init(data): void {
        this.score = data.score;
        this.muted = data.muted;
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    // Creates game objects.
    create(): void {
        var gameWidth = this.game.config.width as number;
        var gameHeight = this.game.config.height as number;

        // Draw background image.
        this.backgroundSprite = this.add.sprite(0, 0, "endBackground");
        this.backgroundSprite.setOrigin(0, 0);
        this.backgroundSprite.setDisplaySize(gameWidth, gameHeight);
        let x = gameWidth / 2 + gameWidth * 0.113;
        if (this.score > 9) {
            x -= gameWidth * 0.02;
        }
        if (this.score > 99) {
            x -= gameWidth * 0.02;
        }
        this.gameNameText = this.add.text(
            x, gameHeight / 2 - gameHeight * 0.16, String(this.score), {color: 'white', fontSize: '48pt'}
        )
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        if (this.startKey.isDown || this.input.activePointer.isDown) {
            this.scene.start("MainScene", {muted: this.muted});
        }
    }
}
