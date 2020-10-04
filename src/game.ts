import "phaser";
import { EndScene } from "./scenes/end_scene";
import { MainScene } from "./scenes/main_scene";
import { TitleScene } from "./scenes/title_scene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    width: 1000,
    height: 800,
    type: Phaser.AUTO,
    parent: "game",
    scene: [TitleScene, MainScene, EndScene],
    input: {
        keyboard: true
    },
    backgroundColor: "#3A99D9",
    render: { pixelArt: false, antialias: false }
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    var game = new Game(config);
});
