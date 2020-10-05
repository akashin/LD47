import { ResourceType } from "../objects/factory";
import { Station } from "../objects/station";
import { MainScene } from "../scenes/main_scene";

export class Tutorial {
    private container: Phaser.GameObjects.Container;
    private station: Station;
    private showedFactoryTip: boolean;

    constructor(mainScene: MainScene, station: Station) {
        this.container = new Phaser.GameObjects.Container(mainScene, 0, 0);
        mainScene.add.existing(this.container);
        this.station = station;
        this.showedFactoryTip = false;
    }

    updateStep(tickCounter: number, mainScene: MainScene): boolean {
        // Returns if tutorial is finished.
        this.container.removeAll();
        if (tickCounter == 35) {
            this.station.setDemand(ResourceType.Steel);
            mainScene.demandCount += 1;
            let text = new Phaser.GameObjects.Text(mainScene, 100, 100, 'A station needs a box of steel! Can you get it some?\nClick to continue.', {color: 'yellow', fontSize: '20pt'});
            this.container.add(text);
            mainScene.pause();
        }
        let nearbyFactory = mainScene.findNearbyFactory();
        if (!this.showedFactoryTip && nearbyFactory && (nearbyFactory.resourceType == ResourceType.Steel)) {
            let text = new Phaser.GameObjects.Text(mainScene, 100, 100, 'Look, you are on a station with still! Click anywhere to pick some.', {color: 'yellow', fontSize: '20pt'});
            this.container.add(text);
            mainScene.pause();
            this.showedFactoryTip = true;
            return false;
        } else {
            if (this.showedFactoryTip) {
                return true;
            }
        }
        // let nearbyStation = mainScene.findNearbyStation();
        // if (nearbyStation && nearbyStation.demand && nearbyStation.demand.resourceType == ResourceType.Steel) {
        //     let text = new Phaser.GameObjects.Text(mainScene, 100, 100, 'Nice, you have delivered the much needed steel!', {color: 'yellow', fontSize: '20pt'});
        //     this.container.add(text);
        //     mainScene.pause();
        //     return true;
        // }
        return false;

    }
}
