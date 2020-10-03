import { Order } from "../core/order";

export class OrderInventory extends Phaser.GameObjects.Container {
    private orderCountText: Phaser.GameObjects.Text;

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        this.orderCountText = scene.make.text({
            x: 600,
            y: 10,
            add: false,
        });
        this.add(this.orderCountText);
    }

    setOrders(orders: Array<Order>): void {
        // TODO: Show orders in the HUD.
    }
}
