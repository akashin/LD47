import { CONST } from "../const";

export enum GroundType {
    Grass,
    Sand,
}

export enum RailType {
    Horizontal,
    Vertical,
    UpRight,
    DownRight,
    DownLeft,
    UpLeft,
}

class Tile extends Phaser.GameObjects.Sprite {
    public groundType: GroundType;

    private static getTextureName(groundType: GroundType): string {
        switch (groundType) {
            case GroundType.Grass:
                return 'grass_tile';
            case GroundType.Sand:
                return 'sand_tile';
        }
        throw new Error('Unknown GroundType');
    }

    constructor(scene: Phaser.Scene, x: number, y: number, groundType: GroundType) {
        super(scene, x, y, Tile.getTextureName(groundType));
        this.groundType = groundType;

        this.setDisplayOrigin(0, 0);
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

class Rail extends Phaser.GameObjects.Sprite {
    public railType: RailType;

    private static getTextureName(railType: RailType): string {
        switch (railType) {
            case RailType.Horizontal:
            case RailType.Vertical:
                return 'rails_top_bottom';
            case RailType.UpRight:
            case RailType.DownRight:
            case RailType.DownLeft:
            case RailType.UpLeft:
                return 'rails_top_right';
        }
        throw new Error('Unknown RailType');
    }

    constructor(scene: Phaser.Scene, x: number, y: number, railType: RailType) {
        super(scene, x + CONST.tileSize / 2, y + CONST.tileSize / 2, Rail.getTextureName(railType));

        this.railType = railType;
        this.updateScaleAndRotation();
    }

    private updateScaleAndRotation() {
        switch (this.railType) {
            case RailType.Horizontal:
                this.setAngle(90);
                break;
            case RailType.Vertical:
                this.setAngle(0);
                break;
            case RailType.UpRight:
                this.setAngle(0);
                break;
            case RailType.DownRight:
                this.setAngle(90);
                break;
            case RailType.DownLeft:
                this.setAngle(180);
                break;
            case RailType.UpLeft:
                this.setAngle(270);
                break;
        }
        this.setDisplaySize(CONST.tileSize, CONST.tileSize);
    }

    updateType(railType: RailType) {
        this.railType = railType;
        this.setTexture(Rail.getTextureName(railType));
        this.updateScaleAndRotation();
    }
}

export class GameMap extends Phaser.GameObjects.Container {
    private tiles: Array<Array<Tile>>;
    private rails: Array<Array<Rail>>;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.tiles = new Array<Array<Tile>>();
        this.rails = new Array<Array<Rail>>();

        for (let x = 0; x < CONST.mapWidth; ++x) {
            this.tiles.push(new Array<Tile>());
            this.rails.push(new Array<Rail>());

            for (let y = 0; y < CONST.mapHeight; ++y) {
                let tile = new Tile(scene, x * CONST.tileSize, y * CONST.tileSize, GroundType.Grass);
                this.tiles[x].push(tile);
                this.add(tile);

                this.rails[x].push(null);
            }
        }
    }

    getGroundType(x: integer, y: integer): GroundType {
        return this.tiles[x][y].groundType;
    }

    updateGroundType(x: integer, y: integer, groundType: GroundType): void {
        this.tiles[x][y].updateGroundType(groundType);
    }

    updateRail(x: integer, y: integer, railType: RailType): void {
        if (this.rails[x][y] != null) {
            this.remove(this.rails[x][y]);
            this.rails[x][y] = null;
        }

        if (railType != null) {
            let rail = new Rail(this.scene, x * CONST.tileSize, y * CONST.tileSize, railType);
            this.rails[x][y] = rail;
            this.add(rail);
        }
    }
}
