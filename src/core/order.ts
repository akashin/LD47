import { CONST } from "../const";
import { Station } from "../objects/station";
import { randomInt } from "../utils/math";
import { GroundType } from "./map";

export enum OrderStatus {
    offered,
    taken,
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
        this.status = OrderStatus.offered;
    }
}

export class OrderManager {
    private stations: Array<Station>;
    private openOrders: Array<Order>;
    private stationSourceOrder: Map<integer, Order>; // For each station shows an open order starting in it (if exist).
    private stationSinkOrders: Array<Array<Order>>; // For each station lists open orders ending in this station.
    private scene: Phaser.Scene;

    // Creates OrderManager objects.
    constructor(scene: Phaser.Scene, stations: Array<Station>) {
        this.scene = scene;

        this.stations = stations;

        this.stationSinkOrders = [];
        for (let i = 0; i < this.stations.length; ++i) {
            this.stationSinkOrders[i] = [];
        }
        this.openOrders = [];
        this.stationSourceOrder = new Map();
    }

    addOrder(): void {
        let numStations = this.stations.length;
        if (this.openOrders.length < numStations) {

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

            var order = new Order(beginStation, endStation);
            this.stationSourceOrder[beginStation] = order;
            this.stationSinkOrders[endStation].push(order);
            this.openOrders.push(order);

            this.renderStationOrders(beginStation);
            this.renderStationOrders(endStation);
        }
    }

    fulfilOrder(order: Order): void {
        delete this.stationSourceOrder[order.sourceStation];
        var idx = -1;
        do {
            idx = this.stationSinkOrders[order.sinkStation].indexOf(order);
            this.stationSinkOrders[order.sinkStation].splice(idx, 1);
        }
        while (idx > -1);
        
        idx = this.openOrders.indexOf(order);
        this.openOrders.splice(idx, 1);

        this.renderStationOrders(order.sourceStation);
        this.renderStationOrders(order.sinkStation);
        
        
    }

    renderStationOrders(station: integer): void {
        // TODO: remove old sprites.
        let locX = this.stations[station].column * CONST.tileSize;
        let locY = this.stations[station].row * CONST.tileSize;
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