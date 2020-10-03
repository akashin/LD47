import { CONST } from "../const";

export enum GroundType {
    Grass,
    Sand,
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
        }
        throw new Error('Unknown GroundType');
    }

    constructor(scene: Phaser.Scene, x: number, y: number, groundType: GroundType) {
        super(scene, x, y, Tile.getTextureName(groundType));
        this.setOrigin(0, 0);

        this.groundType = groundType;
        this.updateScale();
    }

    private updateScale(): void {
        this.setDisplaySize(CONST.tileSize, CONST.tileSize);
    }

    updateGroundType(groundType: GroundType): void {
        this.groundType = groundType;
        this.setTexture(Tile.getTextureName(groundType));
        this.updateScale();
    }
}

export class GameMap extends Phaser.GameObjects.Container {
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
    }

    getGroundType(x: integer, y: integer): GroundType {
        return this.tiles[x][y].groundType;
    }

    updateGroundType(x: integer, y: integer, groundType: GroundType): void {
        this.tiles[x][y].updateGroundType(groundType);
    }
}
