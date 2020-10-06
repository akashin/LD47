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
        let scale = 1.5;
        this.dialogSprite.setDisplaySize(scale * CONST.tileSize * 1.5, scale * CONST.tileSize * 1.5);
        this.add(this.dialogSprite);

        this.resourceSprite = new Phaser.GameObjects.Sprite(scene, scale * CONST.tileSize * 0.75, scale * CONST.tileSize * -0.85, getResourceTextureName(resourceType));
        // this.resourceSprite.setDisplayOrigin(0, this.resourceSprite.height);
        this.resourceSprite.setDisplaySize(scale * CONST.tileSize, scale * CONST.tileSize);
        this.add(this.resourceSprite);
    }

    setPercentage(percentage: number) {
        this.dialogSprite.setTint(0x00ffff);
    }
}

export class Station extends Phaser.GameObjects.Container {
    static stationCount: integer = 0;
    column: integer;
    row: integer;
    index: integer;

    stationSprite: Phaser.GameObjects.Sprite;
    demand: Demand;
    demandStartTime: number;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.index = Station.stationCount++;

        // this.stationSprite = scene.add.sprite(0, 0, 'station_tile');
        // this.stationSprite.setOrigin(0, 0);
        // this.stationSprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        // this.add(this.stationSprite);

        this.demand = null;
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.max(Math.abs(column - this.column), Math.abs(row - this.row)) <= CONST.resourcePickupDistance;
    }

    setDemand(resourceType: ResourceType, timeNow: number): void {
        this.demand = new Demand(this.scene, resourceType);
        this.add(this.demand);
        this.demandStartTime = timeNow;
    }

    removeDemand(): void {
        this.remove(this.demand)
        this.demand = null;
        this.demandStartTime = null;
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

    update(timeNow: number) {
        if (!this.hasDemand()) {
            return;
        }

        // Ignore the tutorial.
        if (timeNow < this.demandStartTime) {
            return;
        }

        this.demand.setPercentage(timeNow - this.demandStartTime);
    }
}
