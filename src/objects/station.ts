import { CONST } from "../const";
import { getResourceTextureName, ResourceType } from "./factory";

class Demand extends Phaser.GameObjects.Container {
    resourceType: ResourceType;
    resourceSprite: Phaser.GameObjects.Sprite;
    dialogSprite: Phaser.GameObjects.Sprite;

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
    }
}

export class Station extends Phaser.GameObjects.Container {
    static stationCount: integer = 0;
    column: integer;
    row: integer;
    index: integer;

    stationSprite: Phaser.GameObjects.Sprite;
    demand: Demand;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.index = Station.stationCount++;

        this.stationSprite = scene.add.sprite(0, 0, 'station_tile');
        this.stationSprite.setOrigin(0, 0);
        this.stationSprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.stationSprite);

        this.demand = null;
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.max(Math.abs(column - this.column), Math.abs(row - this.row)) <= CONST.resourcePickupDistance;
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
