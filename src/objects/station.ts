import { CONST } from "../const";
import { Order } from "../core/order";

class InOrder extends Phaser.GameObjects.Container {
    order_sprite: Phaser.GameObjects.Sprite;

    constructor(scene, params) {
        super(scene, params.x, params.y);

        this.order_sprite = scene.add.sprite(0, 0, "orderSink");
        this.order_sprite.setOrigin(0, 0);
        this.order_sprite.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.order_sprite);
    }
}

class OutOrder extends Phaser.GameObjects.Container {
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

export class Station extends Phaser.GameObjects.Container {
    static station_count: integer = 0;
    column: integer;
    row: integer;
    index: integer;
    station_name: string;

    station_sprite: Phaser.GameObjects.Sprite;
    station_name_text: Phaser.GameObjects.Text;

    in_orders: Map<integer, InOrder>;
    out_orders: Map<integer, OutOrder>;

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

        this.in_orders = new Map();
        this.out_orders = new Map();
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }

    addInOrder(order: Order): void {
        let in_order = new InOrder(this.scene, { x: CONST.tileSize, y: CONST.tileSize });
        this.in_orders.set(order.id, in_order);
        this.add(in_order);
    }

    removeInOrder(order_id: integer): void {
        let in_order = this.in_orders.get(order_id);
        this.in_orders.delete(order_id);
        this.remove(in_order);
    }

    tryFulfilInOrder(order_id: integer): boolean {
        if (!this.in_orders.has(order_id)) {
            return false;
        }
        // TODO: Do some fulfil animation.
        this.removeInOrder(order_id);
    }

    addOutOrder(order: Order, destination: string): void {
        let out_order = new OutOrder(this.scene, { x: CONST.tileSize, y: CONST.tileSize, destination: destination });
        this.out_orders.set(order.id, out_order);
        this.add(out_order);
    }

    removeOutOrder(order: Order): void {
        let out_order = this.out_orders.get(order.id);
        this.out_orders.delete(order.id);
        this.remove(out_order);
    }

    hasOutOrders(): boolean {
        return this.out_orders.size > 0;
    }
}
