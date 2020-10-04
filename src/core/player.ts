import { CONST } from "../const";
import { Direction, getDirectionDX, getDirectionDY } from "../utils/direction";
import { Position } from "../utils/position";
import { GameMap, getAnotherEndDirection } from "./map";

export class Player extends Phaser.GameObjects.Container {
    private gameMap: GameMap;
    private mapPosition: Position;
    private movementDirection: Direction;
    private movementState: number = 0.0;


    constructor(
        scene: Phaser.Scene,
        gameMap: GameMap,
        mapPosition: Position,
        movementDirection: Direction
    ) {
        super(scene, (mapPosition.x + 0.5) * CONST.tileSize, (mapPosition.y + 0.5) * CONST.tileSize);
        this.gameMap = gameMap;
        this.mapPosition = mapPosition;
        this.movementDirection = movementDirection;

        let trainSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'tram_head');
        trainSprite.setDisplaySize(CONST.tileSize * 0.6, CONST.tileSize * 0.6);
        this.add(trainSprite);
    }

    update(delta: number): void {
        this.movementState += delta / 1000.0 * CONST.trainSpeed;
        if (this.movementState >= 1.0) {
            this.movementState -= 1.0;

            this.mapPosition = this.mapPosition.add(this.movementDirection);

            let railType = this.gameMap.getRailType(this.mapPosition.x, this.mapPosition.y);
            this.movementDirection = getAnotherEndDirection(railType, this.movementDirection);
        }

        let dx = getDirectionDX(this.movementDirection) * this.movementState;
        let dy = getDirectionDY(this.movementDirection) * this.movementState;
        this.setPosition(
            (this.mapPosition.x + dx + 0.5) * CONST.tileSize,
            (this.mapPosition.y + dy + 0.5) * CONST.tileSize
        );
    }

    getTileCoordinates(): Array<number> {
        // Floating point coordinates in the tile coordinate system.
        return [this.x / CONST.tileSize - 0.5, this.y / CONST.tileSize - 0.5];
    }

}
