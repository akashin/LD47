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

        let trainSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'blank');
        trainSprite.setDisplaySize(40, 40);
        trainSprite.setTint(0x333333);
        this.add(trainSprite);
    }

    update(delta: number): void {
        console.log((this.mapPosition.x + 0.5) * CONST.tileSize, (this.mapPosition.y + 0.5) * CONST.tileSize);
        this.movementState += delta;
        if (this.movementState >= 1000.0) {
            this.movementState -= 1000.0;

            this.mapPosition = this.mapPosition.add(this.movementDirection);

            let railType = this.gameMap.getRailType(this.mapPosition.x, this.mapPosition.y);
            console.log('railType is', railType, 'movementDirection is', this.movementDirection);
            this.movementDirection = getAnotherEndDirection(railType, this.movementDirection);

            console.log('next direction is', this.movementDirection);
        }

        let dx = getDirectionDX(this.movementDirection) * this.movementState / 1000.0;
        let dy = getDirectionDY(this.movementDirection) * this.movementState / 1000.0;
        this.setPosition(
            (this.mapPosition.x + dx + 0.5) * CONST.tileSize,
            (this.mapPosition.y + dy + 0.5) * CONST.tileSize
        );
    }
}
