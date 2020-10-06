import { CONST } from "../const";
import { randomInt } from "../utils/math";
import { getResourceTextureName, ResourceType } from "./factory";

class Demand extends Phaser.GameObjects.Container {
    resourceType: ResourceType;
    resourceSprite: Phaser.GameObjects.Sprite;
    private dialogSpriteBackground: Phaser.GameObjects.Sprite;
    private dialogSprite: Phaser.GameObjects.Sprite;
    private duration: number;
    expired: boolean;

    private static readonly lastTicks: number = 50;
    private static readonly veryLastTicks: number = 20;

    constructor(scene: Phaser.Scene, resourceType: ResourceType, additionalDuration: number) {
        super(scene, 0, 0);
        this.resourceType = resourceType;

        let scale = 1.5;

        this.dialogSpriteBackground = new Phaser.GameObjects.Sprite(scene, 0, 0, 'dialog');
        this.dialogSpriteBackground.setDisplayOrigin(0, this.dialogSpriteBackground.height);
        this.dialogSpriteBackground.setDisplaySize(scale * CONST.tileSize * 1.5, scale * CONST.tileSize * 1.5);
        this.dialogSpriteBackground.setTint(0x00ffff);
        this.add(this.dialogSpriteBackground);

        this.dialogSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'dialog');
        this.dialogSprite.setDisplayOrigin(0, this.dialogSprite.height);
        this.dialogSprite.setDisplaySize(scale * CONST.tileSize * 1.5, scale * CONST.tileSize * 1.5);
        this.dialogSprite.setTint(0x00aacc);

        this.add(this.dialogSprite);

        this.resourceSprite = new Phaser.GameObjects.Sprite(scene, scale * CONST.tileSize * 0.75, scale * CONST.tileSize * -0.85, getResourceTextureName(resourceType));
        this.resourceSprite.setDisplaySize(scale * CONST.tileSize, scale * CONST.tileSize);
        this.add(this.resourceSprite);

        this.duration = Demand.lastTicks + randomInt(100) + additionalDuration;
    }

    setPercentage(ticksPassed: number) {
        ticksPassed = Math.min(ticksPassed, this.duration);
        if (ticksPassed >= this.duration) {
            this.expired = true;
        }

        if (ticksPassed >= this.duration - Demand.veryLastTicks) {
            this.dialogSprite.setTint(0xff0000);
        } else if (ticksPassed >= this.duration - Demand.lastTicks) {
            let left: integer = this.duration - ticksPassed;
            if (left % 10 > 5) {
                this.dialogSprite.setTint(0xff0000);
            } else {
                this.dialogSprite.setTint(0x00aacc);
            }
        }

        let percentage = ticksPassed / this.duration;
        let height = this.dialogSprite.height * percentage;
        this.dialogSprite.setCrop(0, this.dialogSprite.height - height, this.dialogSprite.width, height);
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

    setDemand(resourceType: ResourceType, timeNow: number, currentScore: number = 0): void {
        let additionalDuration = Math.max(0, 20 - currentScore) * 4;

        this.demand = new Demand(this.scene, resourceType, additionalDuration);
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

    isDemandExpired(): boolean {
        return this.demand.expired;
    }
}
