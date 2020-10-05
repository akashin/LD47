import { CONST } from "../const";

export enum ResourceType {
    Food,
    Steel,
    Water,
    Oxygen,
    Medicine,
}

export function getResourceTextureName(resource_type: ResourceType): string {
    switch (resource_type) {
        case ResourceType.Food:
            return 'resource_food';
        case ResourceType.Steel:
            return 'resource_steel';
        case ResourceType.Water:
            return 'resource_water';
        case ResourceType.Oxygen:
            return 'resource_oxygen';
        case ResourceType.Medicine:
            return 'resource_medicine';
    }
    throw new Error('Unknown ResourceType');
}

class Resource extends Phaser.GameObjects.Container {
    resourceSprite: Phaser.GameObjects.Sprite;

    constructor(scene, params) {
        super(scene, params.x, params.y);

        this.resourceSprite = scene.add.sprite(0, 0, getResourceTextureName(params.resource_type));
        this.resourceSprite.setOrigin(0, 0);
        this.resourceSprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.resourceSprite);
    }
}

export class Factory extends Phaser.GameObjects.Container {
    column: integer;
    row: integer;
    index: integer;
    public resourceType: ResourceType;

    factorySprite: Phaser.GameObjects.Sprite;
    factoryResourceSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.resourceType = params.resourceType;

        // this.factorySprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'factory_tile');
        // this.factorySprite.setOrigin(0, 0);
        // this.factorySprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        // this.add(this.factorySprite);

        this.factoryResourceSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, getResourceTextureName(this.resourceType));
        this.factoryResourceSprite.setDisplaySize(CONST.tileSize * 2, CONST.tileSize * 2);
        this.factoryResourceSprite.setDisplayOrigin(CONST.tileSize * 2, CONST.tileSize * 2);
        this.add(this.factoryResourceSprite);
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.max(Math.abs(column - this.column), Math.abs(row - this.row)) <= CONST.resourcePickupDistance;
    }

    setHighlighted(highlighted: boolean): void {
        // if (highlighted) {
        //     this.factoryResourceSprite.setTint(0xFF0000);
        // } else {
        //     this.factoryResourceSprite.setTint(0xFFFFFF);
        // }
    }
}
