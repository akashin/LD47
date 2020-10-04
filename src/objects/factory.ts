import { CONST } from "../const";

export enum ResourceType {
    Wheat,
    Steel,
    Water,
}


class Resource extends Phaser.GameObjects.Container {
    order_sprite: Phaser.GameObjects.Sprite;
    order_destination_text: Phaser.GameObjects.Text;

    constructor(scene, params) {
        super(scene, params.x, params.y);

        this.order_sprite = scene.add.sprite(0, 0, "order_box");
        this.order_sprite.setOrigin(0, 0);
        this.order_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.order_sprite);

        this.order_destination_text = scene.add.text(0, 0, params.destination);
        this.add(this.order_destination_text);
    }
}

export class Factory extends Phaser.GameObjects.Container {
    column: integer;
    row: integer;
    index: integer;
    public resource_type: ResourceType;

    station_sprite: Phaser.GameObjects.Sprite;
    station_name_text: Phaser.GameObjects.Text;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.resource_type = params.resource_type;

        // TODO: Use factory sprite here.
        this.station_sprite = scene.add.sprite(0, 0, "station_tile");
        this.station_sprite.setOrigin(0, 0);
        this.station_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.station_sprite);

        this.station_name_text = scene.add.text(0, 0, this.resource_type);
        this.add(this.station_name_text);
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }
}
