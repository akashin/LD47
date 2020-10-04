import { CONST } from "../const";
import { getResourceTextureName, ResourceType } from "./factory";

class Demand extends Phaser.GameObjects.Container {
    resourceType: ResourceType;
    resourceSprite: Phaser.GameObjects.Sprite;
    dialogSprite: Phaser.GameObjects.Sprite;
    resourceTypeText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, resourceType: ResourceType) {
        super(scene, 0, 0);
        this.resourceType = resourceType;

        this.dialogSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'dialog');
        this.dialogSprite.setDisplayOrigin(0, this.dialogSprite.height);
        this.dialogSprite.setDisplaySize(CONST.tileSize * 1.5, CONST.tileSize * 1.5);
        this.add(this.dialogSprite);

        this.resourceSprite = new Phaser.GameObjects.Sprite(scene, CONST.tileSize * 0.7, CONST.tileSize * -0.85, getResourceTextureName(resourceType));
        // this.resourceSprite.setDisplayOrigin(0, this.resourceSprite.height);
        this.resourceSprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.resourceSprite);

        this.resourceTypeText = scene.add.text(0, 0, resourceType.toString());
        this.add(this.resourceTypeText);
    }
}

export class Station extends Phaser.GameObjects.Container {
    static station_count: integer = 0;
    column: integer;
    row: integer;
    index: integer;
    station_name: string;

    station_sprite: Phaser.GameObjects.Sprite;
    station_name_text: Phaser.GameObjects.Text;

    demand: Demand;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.station_name = params.station_name;
        this.index = Station.station_count++;

        this.station_sprite = scene.add.sprite(0, 0, 'station_tile');
        this.station_sprite.setOrigin(0, 0);
        this.station_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.station_sprite);

        this.station_name_text = scene.add.text(0, 0, this.station_name);
        this.add(this.station_name_text);

        this.demand = null;
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }

    setDemand(resourceType: ResourceType): void {
        this.demand = new Demand(this.scene, resourceType);
        this.add(this.demand);
    }

    removeDemand(): void {
        this.remove(this.demand)
        this.demand = null;
    }

    hasDemand(): boolean {
        return this.demand != null;
    }

    getDemand() {
        return this.demand;
    }

    tryFulfilDemand(resourceType: ResourceType): boolean {
        if (!this.hasDemand()) {
            return false;
        }
        if (this.demand.resourceType == resourceType) {
            // TODO: Do some fulfil animation.
            this.removeDemand();
            return true;
        }
        return false;
    }
}
