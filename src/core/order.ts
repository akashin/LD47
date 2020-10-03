import { CONST } from "../const";
import { Station } from "../objects/station";
import { randomInt } from "../utils/math";
import { GroundType } from "./map";

export enum OrderStatus {
    offered,
    taken,
}

export class Order {
    public id: integer;
    public sourceStation: integer;
    public sinkStation: integer;
    public status: OrderStatus;

    // Creates Order objects.
    constructor(id: integer, sourceStation: integer, sinkStation: integer) {
        this.id = id;
        this.sourceStation = sourceStation;
        this.sinkStation = sinkStation;
        this.status = OrderStatus.offered;
    }
}

export class OrderManager {
    private stationLocations: Array<Array<integer>>;
    private openOrders: Array<Order>;
    private stationSourceOrder: Map<integer, Order>; // For each station shows an open order starting in it (if exist).
    private stationSinkOrders: Array<Array<Order>>; // For each station lists open orders ending in this station.
    private totalOrdersCount: integer;
    private scene: Phaser.Scene;

    // Creates OrderManager objects.
    constructor(scene: Phaser.Scene, stations: Array<Station>) {
        this.scene = scene;

        this.stationLocations = [];
        for (let i = 0; i < stations.length; ++i) {
            let station = [stations[i].column, stations[i].row];
            this.stationLocations.push(station);
        }

        this.stationSinkOrders = [];
        for (let i = 0; i < this.stationLocations.length; ++i) {
            this.stationSinkOrders[i] = [];
        }
        this.openOrders = [];
        this.stationSourceOrder = new Map();
        this.totalOrdersCount = 0; // Both closed and opened.
    }

    addOrder(): void {
        if (this.openOrders.length < this.stationLocations.length) {
            let beginStation = randomInt(this.stationLocations.length);
            while (this.stationSourceOrder.has(beginStation)) {
                // Make sure source is not already used by some other order.
                beginStation = randomInt(this.stationLocations.length);
            }
            let endStation = randomInt(this.stationLocations.length);
            while (beginStation == endStation) {
              // Make sure source end sink are distinct.
              endStation = randomInt(this.stationLocations.length);
            }
            let source = this.stationLocations[beginStation];
            let sink = this.stationLocations[endStation];

            var order = new Order(this.totalOrdersCount, beginStation, endStation);
            this.stationSourceOrder[beginStation] = order;
            this.stationSinkOrders[endStation].push(order);
            this.openOrders.push(order);

            this.totalOrdersCount += 1;

            this.renderStationOrders(beginStation);
            this.renderStationOrders(endStation);
        }
    }

    renderStationOrders(station: integer): void {
        // TODO: remove old sprites.
        let loc = this.stationLocations[station];
        loc[0] *= CONST.tileSize;
        loc[1] *= CONST.tileSize;
        if (this.stationSourceOrder.has(station)) {
            let order = this.stationSourceOrder[station];
            var orderSource = new Phaser.GameObjects.Image(this.scene, loc[0], loc[1], 'orderSource');
            orderSource.setScale(0.3, 0.3);
            this.scene.add.existing(orderSource);
            this.scene.add.text(loc[0] - 20, loc[1] - 20, String(order.id))
        }

        for (let i = 0; i < this.stationSinkOrders[station].length; ++i) {
            let order = this.stationSinkOrders[station][i];
            let orderSink = new Phaser.GameObjects.Image(this.scene, loc[0], loc[1], 'orderSink');
            orderSink.setScale(0.1, 0.1);
            this.scene.add.existing(orderSink);
            this.scene.add.text(loc[0] - 20, loc[1] - 20, String(order.id))
        }
    }
}