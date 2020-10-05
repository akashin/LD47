import { CONST } from "../const";

export function createPane(container: Phaser.GameObjects.Container, scene, size: number, scale: number) {
    var sprites = [];
    {
        var leftEndSprite = scene.add.sprite(0, 0, "inventory_end");
        leftEndSprite.setOrigin(0, 0);
        leftEndSprite.setDisplaySize(CONST.tileSize * 2 * scale, CONST.tileSize * 2 * scale);
        container.add(leftEndSprite);
    }

    for (let i = 1; i < size - 1; ++i) {
        var leftEndSprite = scene.add.sprite(scale * CONST.tileSize * 2 * i, 0, "inventory_body");
        leftEndSprite.setOrigin(0, 0);
        leftEndSprite.setDisplaySize(scale * CONST.tileSize * 2, scale * CONST.tileSize * 2);
        container.add(leftEndSprite);
    }

    {
        var rightEndSprite = scene.add.sprite(scale * CONST.tileSize * 2 * (size - 1), 0, "inventory_end");
        rightEndSprite.flipX = true;
        rightEndSprite.setOrigin(0, 0);
        rightEndSprite.setDisplaySize(scale * CONST.tileSize * 2, scale * CONST.tileSize * 2);
        container.add(rightEndSprite);
    }
    return sprites
}
