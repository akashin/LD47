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
    private totalOrdersCount: integer; // Both closed and opened.
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
        this.totalOrdersCount = 0;
    }

    addOrder(): void {
        if (this.openOrders.length < this.stationLocations.length) {
            let numStations = this.stationLocations.length;

            let beginStation = randomInt(numStations);
            // Make sure source statation is not already used by some other order.
            while (beginStation in this.stationSourceOrder) {
                beginStation = randomInt(numStations);
            }

            let endStation = randomInt(numStations);
            // Make sure source and sink are distinct.
            while (beginStation == endStation) {
              endStation = randomInt(numStations);
            }

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
        let locX = loc[0] * CONST.tileSize;
        let locY = loc[1] * CONST.tileSize;
        console.log(station, this.stationSourceOrder, station in this.stationSourceOrder)
        if (station in this.stationSourceOrder) {
            let order = this.stationSourceOrder[station];
            var orderSource = new Phaser.GameObjects.Image(this.scene, locX, locY, 'orderSource');
            orderSource.setScale(0.3, 0.3);
            this.scene.add.existing(orderSource);
            this.scene.add.text(locX - 20, locY - 20, String(order.id))
        }

        for (let i = 0; i < this.stationSinkOrders[station].length; ++i) {
            let order = this.stationSinkOrders[station][i];
            let orderSink = new Phaser.GameObjects.Image(this.scene, locX + 80 + i * 50, locY + 80, 'orderSink');
            orderSink.setScale(0.1, 0.1);
            this.scene.add.existing(orderSink);
            this.scene.add.text(locX + 60 + i * 50, locY + 60, String(order.id))
        }
    }
}