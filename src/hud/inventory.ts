import { CONST } from "../const";
import { getResourceTextureName, ResourceType } from "../objects/factory";
import { createPane } from "./pane";

export class Inventory extends Phaser.GameObjects.Container {
    private resources: Array<ResourceType>;
    private resourceTiles: Phaser.GameObjects.Sprite[];

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        this.resources = [];
        this.resourceTiles = [];
        this.setResources(this.resources);
        createPane(this, this.scene, CONST.inventorySize, 1);

        // this.scene.add.sprite(0, 0, "inventory_body");
    }

    getResources() {
        return this.resources;
    }

    addResource(resourceType: ResourceType) {
        this.resources.push(resourceType);
        this.setResources(this.resources);
    }

    removeResource(position: integer) {
        this.resources.splice(position, 1);
        this.setResources(this.resources);
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
