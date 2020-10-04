import { CONST } from "../const";

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
        let text = "Help a mars colony to grow and prosper!\n\n";
        text += "Pick resources with the space button and\n";
        text += "deliver it to settlements in need.\n\n";
        text += "Press space to start.";
        this.gameNameText = this.add.text(
            gameWidth / 2 - 250, gameHeight / 2 - 100, text, {color: 'Yellow', fontSize: '20pt'}
        )
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        if (this.startKey.isDown) {
            this.scene.start("MainScene");
        }
    }
}
