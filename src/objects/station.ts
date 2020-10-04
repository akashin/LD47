import { CONST } from "../const";
import { Order } from "../core/order";

class InOrder extends Phaser.GameObjects.Container {
    order_sprite: Phaser.GameObjects.Sprite;

    constructor(scene, params) {
        super(scene, params.x, params.y);

        this.order_sprite = scene.add.sprite(0, 0, "order_box");
        this.order_sprite.setOrigin(0, 0);
        this.order_sprite.setDisplaySize(CONST.tileSize / 2, CONST.tileSize / 2);
        this.add(this.order_sprite);
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
    out_orders: Order[];

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
        this.out_orders = [];
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }

    addInOrder(order: Order): void {
        let in_order = new InOrder(this.scene, { x: 0, y: 0 });
        this.in_orders[order.id] = in_order;
        this.add(in_order);
    }

    removeInOrder(order: Order): void {
        let in_order = this.in_orders.get(order.id);
        this.in_orders.delete(order.id);
        this.remove(in_order);
    }
}
