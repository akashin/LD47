import { CONST } from "../const";
import { createPane } from "./pane";

export class ScoreBoard extends Phaser.GameObjects.Container {
    private scoreBoardText: Phaser.GameObjects.Text;
    public score: number;

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        createPane(this, this.scene, CONST.inventorySize, 0.4);
        this.scoreBoardText = scene.make.text({
            x: CONST.tileSize * 0.2,
            y: CONST.tileSize * 0.2,
            add: false,
        });
        this.add(this.scoreBoardText);
        this.score = 0;
        this.renderScore()
    }

    increaseScore(delta: number): void {
        this.score += delta;
        this.renderScore();
    }

    private renderScore(): void {
        this.scoreBoardText.setText('Score: ' + String(this.score));
    }
}
