import { CONST } from "../const";
import { Order } from "../core/order";
import { ResourceType } from "./factory";

class Demand extends Phaser.GameObjects.Container {
    order_sprite: Phaser.GameObjects.Sprite;
    // TODO: Use order demand instread.
    order_destination_text: Phaser.GameObjects.Text;
    resource_type: ResourceType;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.resource_type = params.resource_type;

        this.order_sprite = scene.add.sprite(0, 0, "order_box");
        this.order_sprite.setOrigin(0, 0);
        this.order_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.order_sprite);

        this.order_destination_text = scene.add.text(0, 0, params.resource_type);
        this.add(this.order_destination_text);
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

        this.station_sprite = scene.add.sprite(0, 0, "station_tile");
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

    setDemand(resource_type: ResourceType): void {
        this.demand = new Demand(this.scene, { x: CONST.tileSize, y: CONST.tileSize, resource_type: resource_type});
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

    tryFulfilDemand(resource_type: ResourceType): boolean {
        if (!this.hasDemand()) {
            return false;
        }
        // TODO: Do some fulfil animation.
        return this.demand.resource_type == resource_type;
    }
}
