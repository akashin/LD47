import { CONST } from "../const";
import { OrderInventory } from "../hud/order_inventory";
import { Factory, ResourceType } from "../objects/factory";
import { Station } from "../objects/station";
import { randomInt } from "../utils/math";

let assert = require('assert');

export enum OrderStatus {
    open,
    taken,
    fulfiled,
}

export class Order {
    static orderCount: integer = 0;
    public id: integer;
    public sourceStation: integer;
    public sinkStation: integer;
    public status: OrderStatus;

    // Creates Order objects.
    constructor(sourceStation: integer, sinkStation: integer) {
        this.id = Order.orderCount++;
        this.sourceStation = sourceStation;
        this.sinkStation = sinkStation;
        this.status = OrderStatus.open;
    }
}

export class OrderManager {
    private stations: Array<Station>;
    private demand_count: number;
    public resourcesInInventory: Array<ResourceType>;
    private scene: Phaser.Scene;
    private resourceInventory: OrderInventory;

    // Creates OrderManager objects.
    constructor(scene: Phaser.Scene, stations: Array<Station>) {
        this.scene = scene;

        this.stations = stations;

        this.demand_count = 0;
        this.resourcesInInventory = [];
        this.resourceInventory = new OrderInventory(scene, CONST.inventoryX, CONST.inventoryY,);
        this.scene.add.existing(this.resourceInventory);
    }

    addDemand(): boolean {
        let numStations = this.stations.length;
        // No more space to create orders.
        if (this.demand_count >= numStations) {
            return false;
        }

        let station_index = randomInt(numStations);
        // Make sure station does not already have a demand.
        while (this.stations[station_index].hasDemand()) {
            station_index = randomInt(numStations);
        }
        assert(this.stations[station_index].index == station_index);

        // TODO: Generate resource type.
        this.stations[station_index].setDemand(ResourceType.Steel);
        this.demand_count += 1;

        return true;
    }

    getStationDemands(station_index: integer) {
        return this.stations[station_index].getDemand();
    }

    pickResource(factory: Factory): void {
        this.resourcesInInventory.push(factory.resource_type);
        this.resourceInventory.setResources(this.resourcesInInventory);
    }

    fulfilDemandInStation(station): number {
        for (let i = 0; i < this.resourcesInInventory.length; ++i) {
            if (station.tryFulfilDemand(this.resourcesInInventory[i])) {
                this.resourcesInInventory.splice(i);
                this.demand_count -= 1;
                return 1;
            }
        }
        return 0;
    }
}
