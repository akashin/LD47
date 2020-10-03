import { CONST } from "../const";
import { OrderInventory } from "../hud/orderInventory";
import { Station } from "../objects/station";
import { randomInt } from "../utils/math";
import { GroundType } from "./map";

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
    private ordersInInventory: Array<Order>;
    public stationSourceOrder: Map<integer, Order>; // For each station shows an open order starting in it (if exist).
    private stationSinkOrders: Array<Array<Order>>; // For each station lists open orders ending in this station.
    private stationContainer: Array<Phaser.GameObjects.Container>; // For each station list of all images and texts.
    private scene: Phaser.Scene;
    private orderInventory: OrderInventory;

    // Creates OrderManager objects.
    constructor(scene: Phaser.Scene, stations: Array<Station>) {
        this.scene = scene;

        this.stations = stations;

        this.stationSinkOrders = [];
        this.stationContainer = [];
        for (let i = 0; i < this.stations.length; ++i) {
            this.stationSinkOrders[i] = [];
            this.stationContainer[i] = new Phaser.GameObjects.Container(scene);
            this.scene.add.existing(this.stationContainer[i]);
        }
        this.openOrders = [];
        this.ordersInInventory = [];
        this.orderInventory = new OrderInventory(scene, CONST.inventoryX, CONST.inventoryY, );
        this.scene.add.existing(this.orderInventory);
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

            var assert = require('assert');
            assert(this.stations[beginStation].index == beginStation);
            assert(this.stations[endStation].index == endStation);

            var order = new Order(beginStation, endStation);
            this.stationSourceOrder[beginStation] = order;
            this.stationSinkOrders[endStation].push(order);
            this.openOrders.push(order);

            this.renderStationOrders(beginStation);
            this.renderStationOrders(endStation);
        }
    }

    pickOrder(order: Order): void {        
        var assert = require('assert');
        assert(order.status == OrderStatus.open);
        order.status = OrderStatus.taken;

        delete this.stationSourceOrder[order.sourceStation];
        let idx = this.stationSinkOrders[order.sinkStation].indexOf(order);
        this.stationSinkOrders[order.sinkStation].splice(idx, 1);
        
        idx = this.openOrders.indexOf(order);
        this.openOrders.splice(idx, 1);

        this.ordersInInventory.push(order);
        this.orderInventory.setOrders(this.ordersInInventory);

        this.renderStationOrders(order.sourceStation);
        this.renderStationOrders(order.sinkStation);   
    }

    renderStationOrders(station: integer): void {
        // Remove old sprites.
        this.stationContainer[station].removeAll();

        let locX = this.stations[station].column * CONST.tileSize;
        let locY = this.stations[station].row * CONST.tileSize;
        if (station in this.stationSourceOrder) {
            let order = this.stationSourceOrder[station];
            var orderSource = new Phaser.GameObjects.Image(this.scene, locX, locY, 'orderSource');
            orderSource.setScale(0.3, 0.3);
            this.stationContainer[station].add(orderSource);
            let text = new Phaser.GameObjects.Text(this.scene, locX - 20, locY - 20, String(order.id), {fontSize: "15pt", color: "#000"});
            this.stationContainer[station].add(text);
        }

        for (let i = 0; i < this.stationSinkOrders[station].length; ++i) {
            let order = this.stationSinkOrders[station][i];
            let orderSink = new Phaser.GameObjects.Image(this.scene, locX + 80 + i * 50, locY + 80, 'orderSink');
            orderSink.setScale(0.1, 0.1);
            this.stationContainer[station].add(orderSink);
            let text = new Phaser.GameObjects.Text(this.scene, locX + 60 + i * 50, locY + 60, String(order.id), {fontSize: "15pt", color: "#000"});
            this.stationContainer[station].add(text);
        }
    }
}