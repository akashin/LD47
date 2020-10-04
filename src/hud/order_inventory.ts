import { ResourceType } from "../objects/factory";

export class OrderInventory extends Phaser.GameObjects.Container {
    private orderCountText: Phaser.GameObjects.Text;

    constructor(scene, x: number, y: number) {
        super(scene, x, y);

        this.orderCountText = scene.make.text({
            // TODO: why not x, y?
            x: 600,
            y: 10,
            add: false,
        });
        this.add(this.orderCountText);
    }

    setResources(resources: Array<ResourceType>): void {
        let status = 'Resources in inventory:\n';
        resources.forEach(element => {
            status += element + ', ';
        });
        this.orderCountText.setText(status);
    }
}
