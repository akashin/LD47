import { CONST } from "../const";
import { getResourceTextureName, ResourceType } from "./factory";

class Demand extends Phaser.GameObjects.Container {
    demand_sprite: Phaser.GameObjects.Sprite;
    resource_type_text: Phaser.GameObjects.Text;
    resource_type: ResourceType;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.resource_type = params.resource_type;

        this.demand_sprite = scene.add.sprite(0, 0, getResourceTextureName(params.resource_type));
        this.demand_sprite.setOrigin(0, 0);
        this.demand_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.demand_sprite);

        this.resource_type_text = scene.add.text(0, 0, params.resource_type);
        this.add(this.resource_type_text);
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
        if (this.demand.resource_type == resource_type) {
            // TODO: Do some fulfil animation.
            this.removeDemand();
            return true;
        }
        return false;
    }
}
