import "phaser";
import { MainScene } from "./scenes/mainScene";

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: "game",
  scene: [MainScene],
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
