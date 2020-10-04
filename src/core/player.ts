import { CONST } from "../const";
import { Direction, getDirectionDX, getDirectionDY, getOppositeDirection } from "../utils/direction";
import { Position } from "../utils/position";
import { GameMap, getAnotherEndDirection } from "./map";

enum TramSectionType {
    Head,
    Carriage,
}

class TramSectionState extends Phaser.GameObjects.Sprite {
    public tramSectionType: TramSectionType;
    public mapPosition: Position;
    public movementDirection: Direction;
    public movementState: number = 0.0;

    constructor(scene: Phaser.Scene, mapPosition: Position, movementDirection: Direction, tramSectionType: TramSectionType) {
        super(scene, 0, 0, tramSectionType == TramSectionType.Head ? 'tram_head' : 'tram_carriage');

        this.tramSectionType = tramSectionType;
        this.mapPosition = mapPosition;
        this.movementDirection = movementDirection;

        this.updateScale();
    }

    private updateScale(): void {
        this.setDisplaySize(CONST.tileSize * 0.6, CONST.tileSize * 0.6);
    }

    update(): void {
        switch (this.movementDirection) {
            case Direction.Up:
                this.setAngle(270);
                this.setFlipX(true);
                break;
            case Direction.Right:
                this.setAngle(0);
                this.setFlipX(true);
                break;
            case Direction.Down:
                this.setAngle(90);
                this.setFlipX(true);
                break;
            case Direction.Left:
                this.setAngle(0);
                this.setFlipX(false);
                break;
        }
    }
}

export class Player extends Phaser.GameObjects.Container {
    private gameMap: GameMap;
    private tramSectionStates: Array<TramSectionState>;

    constructor(
        scene: Phaser.Scene,
        gameMap: GameMap,
        mapPosition: Position,
        movementDirection: Direction
    ) {
        super(scene, (mapPosition.x + 0.5) * CONST.tileSize, (mapPosition.y + 0.5) * CONST.tileSize);
        this.gameMap = gameMap;

        this.tramSectionStates = new Array<TramSectionState>();
        for (let i = 0; i < 1 + CONST.trainCarriagesCount; ++i) {
            let tramSectionType = i == 0 ? TramSectionType.Head : TramSectionType.Carriage;
            let tramSectionState = new TramSectionState(scene, mapPosition, movementDirection, tramSectionType);
            this.tramSectionStates.push(tramSectionState)
            this.add(tramSectionState);

            let railType = this.gameMap.getRailType(mapPosition.x, mapPosition.y);
            let backwardDirection = getAnotherEndDirection(railType, getOppositeDirection(movementDirection));
            mapPosition = mapPosition.add(backwardDirection);
            movementDirection = getOppositeDirection(backwardDirection);
        }
    }

    update(delta: number, distanceToNearestStation: number): void {
        let goodDistance = CONST.trainGoodDistanceInTiles * CONST.tileSize;
        let ignoreDistance = CONST.trainIgnoreDistanceInTiles * CONST.tileSize;

        let distance = Math.min(distanceToNearestStation, goodDistance);
        distance = Math.max(distance, ignoreDistance);

        let ratio = distance / goodDistance;
        let speed = CONST.trainMinSpeed + (CONST.trainMaxSpeed - CONST.trainMinSpeed) * ratio;

        for (let state of this.tramSectionStates) {
            state.movementState += delta / 1000.0 * speed;
            if (state.movementState >= 1.0) {
                state.movementState -= 1.0;

                state.mapPosition = state.mapPosition.add(state.movementDirection);

                let railType = this.gameMap.getRailType(state.mapPosition.x, state.mapPosition.y);
                state.movementDirection = getAnotherEndDirection(railType, state.movementDirection);

                state.update();
            }
        }

        {
            let headSection = this.tramSectionStates[0];

            let dx = getDirectionDX(headSection.movementDirection) * headSection.movementState;
            let dy = getDirectionDY(headSection.movementDirection) * headSection.movementState;
            this.setPosition(
                (headSection.mapPosition.x + dx + 0.5) * CONST.tileSize,
                (headSection.mapPosition.y + dy + 0.5) * CONST.tileSize
            );
        }

        for (let section of this.tramSectionStates) {
            let dx = getDirectionDX(section.movementDirection) * section.movementState;
            let dy = getDirectionDY(section.movementDirection) * section.movementState;
            section.setPosition(
                (section.mapPosition.x + dx + 0.5) * CONST.tileSize - this.x,
                (section.mapPosition.y + dy + 0.5) * CONST.tileSize - this.y
            );
        }
    }

    getTileCoordinates(): Array<number> {
        // Floating point coordinates in the tile coordinate system.
        return [this.x / CONST.tileSize - 0.5, this.y / CONST.tileSize - 0.5];
    }
}
