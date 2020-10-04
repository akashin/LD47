export class ScoreBoard extends Phaser.GameObjects.Container {
    private scoreBoardText: Phaser.GameObjects.Text;
    public score: number;

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        this.scoreBoardText = scene.make.text({
            x: x,
            y: y,
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
