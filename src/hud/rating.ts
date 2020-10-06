import { CONST } from "../const";
import { createPane } from "./pane";

export class Raiting extends Phaser.GameObjects.Container {
    private stars: Array<Phaser.GameObjects.Sprite>;
    private ratingText: Phaser.GameObjects.Text;
    private rating: number = CONST.startingRating;
    private visualRating: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.visualRating = this.rating;

        createPane(this, scene, 5, 0.4);

        this.stars = new Array<Phaser.GameObjects.Sprite>();
        for (let i = 0; i < 5; ++i) {
            let star = new Phaser.GameObjects.Sprite(scene, 72 + 25 * i, 17, 'star_empty');
            this.stars.push(star);
            this.add(star);
        }

        this.ratingText = new Phaser.GameObjects.Text(scene, 35, 19, '', {color: 'white', fontSize: '14pt'});
        this.add(this.ratingText);
        this.updateTextAndStars();
    }

    // decreaseRating(delta: number): void {
    //     this.rating = Math.max(0, this.rating - CONST.ratingDecreasePerSecond * delta / 1000);
    //     this.updateTextAndStars();
    // }

    decreaseRatingOnExpiration(): void {
        let amount = CONST.ratingDecreaseOnExpirationMin + Math.random() * (CONST.ratingDecreaseOnExpirationMax - CONST.ratingDecreaseOnExpirationMin);
        this.rating = Math.max(0, this.rating - amount);
        this.updateTextAndStars();
    }

    increaseReatingOnDelivery(count: integer): void {
        for (let i = 0; i < count; ++i) {
            let amount = CONST.ratingIncreaseOnDeliveryMin + Math.random() * (CONST.ratingIncreaseOnDeliveryMax - CONST.ratingIncreaseOnDeliveryMin);
            this.rating = Math.min(CONST.maxRating, this.rating + amount);
        }
        this.updateTextAndStars();
    }

    private updateTextAndStars(): void {
        this.ratingText.setText(this.visualRating.toFixed(2));
        let rectange = new Phaser.Geom.Rectangle();
        this.ratingText.getBounds(rectange);
        this.ratingText.setDisplayOrigin(rectange.width / 2, rectange.height / 2);

        let rounded = Math.floor(this.visualRating / 0.5);

        for (let i = 0; i < 5; ++i) {
            let star = this.stars[i];
            if (rounded >= (i + 1) * 2) {
                star.setTexture('star_full');
                star.setFlipX(false);
            } else if (rounded >= i * 2 + 1) {
                star.setTexture('star_half');
                star.setFlipX(true);
            } else {
                star.setTexture('star_empty');
                star.setFlipX(false);
            }
            star.setDisplaySize(18, 18);
        }
    }

    update(delta: number): void {
        let diff = this.rating - this.visualRating;
        if (Math.abs(diff) < 0.001) {
            this.visualRating = this.rating;
            return;
        }
        let secondsPerRating = 1;

        if (diff > 0) {
            this.visualRating = Math.min(this.visualRating + delta / 1000 / secondsPerRating, this.rating);
        } else {
            this.visualRating = Math.max(this.visualRating - delta / 1000 / secondsPerRating, this.rating);
        }

        this.updateTextAndStars();
    }
}
