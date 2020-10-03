import { CONST } from "../const";

export enum GroundType {
    Grass,
    Sand,
    Station,
}

export class Tile extends Phaser.GameObjects.Sprite {
    public groundType: GroundType;

    private static getTextureName(groundType: GroundType): string {
        switch (groundType) {
            case GroundType.Grass:
                return 'grass_tile';
                break;
            case GroundType.Sand:
                return 'sand_tile';
                break;
            case GroundType.Station:
                return 'station_tile';
                break;
        }
        throw new Error('Unknown GroundType');
    }

    constructor(scene: Phaser.Scene, x: number, y: number, groundType: GroundType) {
        super(scene, x, y, Tile.getTextureName(groundType));

        this.groundType = groundType;

        this.setOrigin(0, 0);
        this.setDisplaySize(64, 64);
    }

    updateGroundType(groundType: GroundType): void {
        this.groundType = groundType;
        this.setTexture(Tile.getTextureName(groundType));
    }
}

export class Map extends Phaser.GameObjects.Container {
    private tiles: Array<Array<Tile>>;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.tiles = new Array<Array<Tile>>();

        for (let x = 0; x < CONST.mapWidth; ++x) {
            this.tiles.push(new Array<Tile>());

            for (let y = 0; y < CONST.mapHeight; ++y) {
                let tile = new Tile(scene, x * CONST.tileSize, y * CONST.tileSize, GroundType.Grass);
                this.tiles[x].push(tile);
                this.add(tile);
            }
        }

        scene.add.existing(this);
    }

    getGroundType(x: integer, y: integer): GroundType {
        return this.tiles[x][y].groundType;
    }

    updateGroundType(x: integer, y: integer, groundType: GroundType): void {
        this.tiles[x][y].updateGroundType(groundType);
    }
}
