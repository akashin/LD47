import { CONST } from "../const";
import { Direction, getOppositeDirection } from "../utils/direction";

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

function getRailDirections(railType: RailType): [Direction, Direction] {
    switch (railType) {
        case RailType.Horizontal:
            return [Direction.Left, Direction.Right];
        case RailType.Vertical:
            return [Direction.Up, Direction.Down];
        case RailType.UpRight:
            return [Direction.Up, Direction.Right];
        case RailType.DownRight:
            return [Direction.Down, Direction.Right];
        case RailType.DownLeft:
            return [Direction.Down, Direction.Left];
        case RailType.UpLeft:
            return [Direction.Up, Direction.Left];
    }
    throw new Error('Unknown RailType' + String(railType));
}

export function getAnotherEndDirection(railType: RailType, direction: Direction): Direction {
    let directions: [Direction, Direction] = getRailDirections(railType);
    if (direction == getOppositeDirection(directions[0])) {
        return directions[1];
    }
    if (direction == getOppositeDirection(directions[1])) {
        return directions[0];
    }
    return null;
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

    private tilesContainer: Phaser.GameObjects.Container;
    private railsContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.tilesContainer = new Phaser.GameObjects.Container(scene);
        this.railsContainer = new Phaser.GameObjects.Container(scene);
        this.add(this.tilesContainer);
        this.add(this.railsContainer);

        this.tiles = new Array<Array<Tile>>();
        this.rails = new Array<Array<Rail>>();

        for (let x = 0; x < CONST.mapWidth; ++x) {
            this.tiles.push(new Array<Tile>());
            this.rails.push(new Array<Rail>());

            for (let y = 0; y < CONST.mapHeight; ++y) {
                this.tiles[x].push(null);
                this.rails[x].push(null);
            }
        }
    }

    getGroundType(x: integer, y: integer): GroundType {
        if (this.tiles[x][y] == null) {
            return null;
        } else {
            return this.tiles[x][y].groundType;
        }
    }

    updateGround(x: integer, y: integer, groundType: GroundType): void {
        if (groundType == null) {
            if (this.tiles[x][y] != null) {
                this.tilesContainer.remove(this.tiles[x][y]);
                this.tiles[x][y] = null;
            }
        } else {
            if (this.tiles[x][y] == null) {
                let tile = new Tile(this.scene, x * CONST.tileSize, y * CONST.tileSize, groundType);
                this.tiles[x][y] = tile;
                this.tilesContainer.add(tile);
            } else {
                this.tiles[x][y].updateGroundType(groundType);
            }
        }
    }

    getRailType(x: integer, y: integer): RailType {
        if (this.rails[x][y] == null) {
            return null;
        } else {
            return this.rails[x][y].railType;
        }
    }

    updateRail(x: integer, y: integer, railType: RailType): void {
        if (this.rails[x][y] != null) {
            this.railsContainer.remove(this.rails[x][y]);
            this.rails[x][y] = null;
        }

        if (railType != null) {
            let rail = new Rail(this.scene, x * CONST.tileSize, y * CONST.tileSize, railType);
            this.rails[x][y] = rail;
            this.railsContainer.add(rail);
        }
    }

    isInsideMap(x: integer, y: integer): boolean {
        return x >= 0 && x < CONST.mapWidth && y >= 0 && y < CONST.mapHeight;
    }

    generatePlatform(platformX: integer, platformY: integer): void {
        for (let x = platformX - 1; x <= platformX + 1; ++x) {
            for (let y = platformY - 1; y <= platformY + 1; ++y) {
                if (this.isInsideMap(x, y) && this.getRailType(x, y) != null) {
                    this.updateGround(x, y, GroundType.Sand);
                }
            }
        }
    }
}
