import { CONST } from "../const";

export class Raiting extends Phaser.GameObjects.Container {
    private ratingBarBackground: Phaser.GameObjects.Sprite;
    private ratingBar: Phaser.GameObjects.Sprite;
    private ratingText: Phaser.GameObjects.Text;
    private rating: number = CONST.startingRating;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // this.ratingBarBackground = new Phaser.GameObjects.Sprite(scene, 0, 0, 'sand_tile');
        // this.ratingBarBackground.setDisplayOrigin(0, 0);
        // this.ratingBarBackground.setDisplaySize(CONST.maxRating + 2, 22);
        // this.ratingBarBackground.setTintFill(0xFFFFFF);
        // this.add(this.ratingBarBackground);

        // this.ratingBar = new Phaser.GameObjects.Sprite(scene, 1, 1, 'sand_tile');
        // this.ratingBar.setDisplayOrigin(0, 0);
        // this.ratingBar.setDisplaySize(this.rating, 20);
        // this.ratingBar.setTintFill(0xAAAA00);
        // this.add(this.ratingBar);

        this.ratingText = new Phaser.GameObjects.Text(scene, 0, 0, '', {color: 'yellow', fontSize: '14pt'});
        this.add(this.ratingText);
        this.updateText();
    }

    decreaseRating(delta: number): void {
        this.rating = Math.max(0, this.rating - CONST.ratingDecreasePerSecond * delta / 1000);
        this.updateText();
    }

    increaseReatingOnDelivery(count: integer): void {
        this.rating = Math.min(CONST.maxRating, this.rating + CONST.ratingIncreaseOnDelivery * count);
        this.updateText();
    }

    private updateText(): void {
        this.ratingText.setText(this.rating.toFixed(2));
        let rectange = new Phaser.Geom.Rectangle();
        this.ratingText.getBounds(rectange);
        this.ratingText.setDisplayOrigin(rectange.width / 2, rectange.height / 2);
    }
}
