import { CONST } from "../const";
import { getResourceTextureName, ResourceType } from "../objects/factory";

export class OrderInventory extends Phaser.GameObjects.Container {
    private orderCountText: Phaser.GameObjects.Text;
    private resourceTiles: Phaser.GameObjects.Sprite[];

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        this.resourceTiles = [];

        this.orderCountText = scene.make.text({
            x: x,
            y: y,
        });
        this.add(this.orderCountText);
        this.setResources([]);
    }

    setResources(resources: Array<ResourceType>): void {
        for (let resourceTile of this.resourceTiles) {
            this.remove(resourceTile);
        }
        this.resourceTiles = [];

        let shiftX = 0;
        for (let resource of resources) {
            let resourceTile = this.scene.add.sprite(shiftX, 0, getResourceTextureName(resource));
            resourceTile.setOrigin(0, 0);
            resourceTile.setDisplaySize(CONST.tileSize * 2, CONST.tileSize * 2);
            this.resourceTiles.push(resourceTile);
            this.add(resourceTile);
            shiftX += CONST.tileSize * 2;
        }
    }
}
