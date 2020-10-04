import { CONST } from "../const";
import { OrderInventory } from "../hud/order_inventory";
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
    private openOrders: Array<Order>;
    public ordersInInventory: Array<Order>;
    private scene: Phaser.Scene;
    private orderInventory: OrderInventory;

    // Creates OrderManager objects.
    constructor(scene: Phaser.Scene, stations: Array<Station>) {
        this.scene = scene;

        this.stations = stations;

        this.openOrders = [];
        this.ordersInInventory = [];
        this.orderInventory = new OrderInventory(scene, CONST.inventoryX, CONST.inventoryY,);
        this.scene.add.existing(this.orderInventory);
    }

    addOrder(): boolean {
        let numStations = this.stations.length;
        // No more space to create orders.
        if (this.openOrders.length >= numStations) {
            return false;
        }

        let beginStation = randomInt(numStations);
        // Make sure source statation is not already used by some other order.
        while (this.stations[beginStation].hasOutOrders()) {
            beginStation = randomInt(numStations);
        }

        let endStation = randomInt(numStations);
        // Make sure source and sink are distinct.
        while (beginStation == endStation) {
            endStation = randomInt(numStations);
        }

        assert(this.stations[beginStation].index == beginStation);
        assert(this.stations[endStation].index == endStation);

        var order = new Order(beginStation, endStation);
        this.stations[beginStation].addOutOrder(order, String(endStation));
        this.stations[endStation].addInOrder(order);

        this.openOrders.push(order);

        return true;
    }

    getStationOpenOrder(station_index: integer) {
        for (let order of this.openOrders) {
            if (order.sourceStation == station_index) {
                return order;
            }
        }
        return null;
    }

    pickOrder(order: Order): void {
        console.log('Removing order ', order.id, ' from ', order.sourceStation);
        assert(order.status == OrderStatus.open);
        order.status = OrderStatus.taken;

        let idx = this.openOrders.indexOf(order);
        this.openOrders.splice(idx, 1);

        this.stations[order.sourceStation].removeOutOrder(order);
        // TODO: Mark order as picked in In station.

        this.ordersInInventory.push(order);
        this.orderInventory.setOrders(this.ordersInInventory);
    }

    fulfilOrdersInStations(station): number {
        let originalInventorySize = this.ordersInInventory.length;
        for (let order of this.ordersInInventory) {
            if (order.sinkStation == station.id) {
                station.tryFulfilInOrder(order.id);
            }
        }
        this.ordersInInventory = this.ordersInInventory.filter(order => order.sinkStation != station.index);
        let newInventorySize = this.ordersInInventory.length;
        this.orderInventory.setOrders(this.ordersInInventory);
        return originalInventorySize - newInventorySize;
    }
}
