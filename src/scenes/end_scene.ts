import { CONST } from "../const";
import { randomInt } from "../utils/math";

export class EndScene extends Phaser.Scene {
    private backgroundSprite: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;
    private gameNameText: Phaser.GameObjects.Text;
    private score: number;

    constructor() {
        super({
            key: "EndScene"
        });
    }

    // Preloads game resources.
    preload(): void {
        this.load.image("titleBackground", "./assets/bckgrnd_7.png");
    }

    // Initializes game state.
    init(data): void {
        this.score = data.score;
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
        let text = "You lost!\n\n";
        text += 'Score: ' + String(this.score) + '\n\n';
        text += "Click to re-start.\n\n\n\n\n";
        text += "Made by \n";
        let names = ['Andrey Kashin', 'Marina Tarasova', 'Andrew Osipov', 'Alex Novikov'];
        this.randomShuffle(names).forEach(name => {
            text += '  ' + name + '\n';
        });
        text += "in no particular order."
        this.gameNameText = this.add.text(
            gameWidth / 2 - 170, gameHeight / 2 - 170, text, {color: 'yellow', fontSize: '20pt'}
        )
    }

    randomShuffle(arr: Array<String>): Array<String> {
        var newArr = [];
        let remaining = arr;
        let i = 0;
        while (remaining.length > 0) {
            let curr = randomInt(remaining.length);
            newArr.push(remaining[curr]);
            remaining.splice(curr, 1);
        }
        return newArr;
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
        if (this.startKey.isDown || this.input.activePointer.isDown) {
            this.scene.start("MainScene");
        }
    }
}
