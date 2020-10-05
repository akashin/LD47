import { CONST } from "../const";
import { ResourceType } from "../objects/factory";
import { Station } from "../objects/station";
import { MainScene } from "../scenes/main_scene";
import { createPane } from "./pane";

export class Tutorial {
    private container: Phaser.GameObjects.Container;
    private station: Station;
    private showedDemandTip: boolean;
    private showedFactoryTip: boolean;
    private mainScene: MainScene;

    constructor(mainScene: MainScene, station: Station) {
        this.mainScene = mainScene;
        this.container = new Phaser.GameObjects.Container(mainScene, 350, 200);
        mainScene.add.existing(this.container);
        this.station = station;
        this.showedDemandTip = false;
        this.showedFactoryTip = false;
    }

    updateStep(mainScene: MainScene, playerX: number, playerY: number): boolean {
        // Returns if tutorial is finished.
        this.container.removeAll();
        if (!this.showedDemandTip && (Math.abs(playerX - 900) < 100) && (Math.abs(playerY - 72) < 5)) {
            this.station.setDemand(ResourceType.Steel);
            mainScene.demandCount += 1;
            createPane(this.container, this.mainScene, 4);
            let text = new Phaser.GameObjects.Text(mainScene, 14, 14, 'A station needs steel!\nClick to continue.', {color: 'yellow', fontSize: '20pt'});
            this.container.add(text);
            mainScene.pause();
            this.showedDemandTip = true;
        }
        let nearbyFactory = mainScene.findNearbyFactory();
        if (!this.showedFactoryTip && nearbyFactory && (nearbyFactory.resourceType == ResourceType.Steel)) {
            createPane(this.container, this.mainScene, 5);
            let text = new Phaser.GameObjects.Text(mainScene, 14, 14, "You're on a still factory!\nClick anywhere to pick some.", {color: 'yellow', fontSize: '20pt'});
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
