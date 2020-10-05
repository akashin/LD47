import { CONST } from "../const";

export class TitleScene extends Phaser.Scene {
    private backgroundSprite: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "TitleScene"
        });
    }

    // Preloads game resources.
    preload(): void {
        this.load.image("titleBackground", "./assets/title.png");
        this.load.image('playNow', './assets/play_now.png');
        this.load.image('tutorial', './assets/tutorial.png');
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
        this.backgroundSprite = this.add.sprite(0, 0, "titleBackground");
        this.backgroundSprite.setOrigin(0, 0);
        this.backgroundSprite.setDisplaySize(gameWidth, gameHeight);

        let tutorial = new Phaser.GameObjects.Sprite(this, 6 * CONST.tileSize, 10.5 * CONST.tileSize, 'tutorial');
        this.add.existing(tutorial);
        tutorial.setScale(0.4);
        tutorial.setInteractive();
        let This = this;
        tutorial.on('pointerdown', function (pointer) {
            This.scene.start("MainScene", {tutorial: true});
        });
        let playNow = new Phaser.GameObjects.Sprite(this, 15 * CONST.tileSize, 10.5 * CONST.tileSize, 'playNow');
        this.add.existing(playNow);
        playNow.setScale(0.4).setInteractive().on('pointerdown', function (pointer) {
            This.scene.start("MainScene", {tutorial: false});
        });
    }
}
