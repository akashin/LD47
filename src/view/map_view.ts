import { CONST } from "../const";
import { GroundType, Map } from "../core/map";

export class MapView extends Phaser.GameObjects.Container {
    private map: Map;
    private groundTiles: Array<Array<Phaser.GameObjects.Sprite>>;

    private static getTextureName(groundType: GroundType): string {
        switch (groundType) {
            case GroundType.Grass:
                return 'grass_tile';
                break;
            case GroundType.Sand:
                return 'sand_tile';
                break;
        }
        throw new Error('Unknown GroundType');
    }

    constructor(scene: Phaser.Scene, x: number, y: number, map: Map) {
        super(scene, x, y);
        this.map = map;

        this.groundTiles = new Array<Array<Phaser.GameObjects.Sprite>>();

        for (let x = 0; x < CONST.mapWidth; ++x) {
            this.groundTiles.push(new Array<Phaser.GameObjects.Sprite>());
            for (let y = 0; y < CONST.mapHeight; ++y) {
                let textureName = MapView.getTextureName(map.getGroundType(x, y));
                let tileSprite = scene.add.sprite(x * CONST.tileSize, y * CONST.tileSize, textureName);
                this.groundTiles[x].push(tileSprite);

                this.add(tileSprite);
            }
        }
    }
}