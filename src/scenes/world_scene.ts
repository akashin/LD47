import { CONST } from "../const";
import { Map } from "../core/map";
import { MapView } from "../view/map_view";

export class WorldScene extends Phaser.Scene {
    private map: Map;
    private mapView: MapView;

    constructor() {
      super({
        key: "MainScene"
      });
    }

    // Preloads game resources.
    preload(): void {
        this.load.image('grass_tile', 'assets/grass.png');
        this.load.image('sand_tile', 'assets/sand.png');
    }

    // Initializes game state.
    init(): void {
    }

    // Creates game objects.
    create(): void {
        var gameWidth = this.game.config.width as number;
        var gameHeight = this.game.config.height as number;

        this.map = new Map();
        this.mapView = new MapView(this, 0, 0, this.map);

        this.add.sprite(10 * CONST.tileSize, 10 * CONST.tileSize, 'grass_tile');

    //   this.helloWorldText = this.add.text(
    //     gameWidth / 2 - 50, gameHeight / 2 - 20, "Hello, world!"
    //   )
    }

    // Called periodically to update game state.
    update(time: number, delta: number): void {
    }
  }
