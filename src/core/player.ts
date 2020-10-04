import { CONST } from "../const";
import { Direction, getDirectionDX, getDirectionDY } from "../utils/direction";
import { Position } from "../utils/position";
import { GameMap, getAnotherEndDirection } from "./map";

class TramSectionState extends Phaser.GameObjects.Sprite {
    public mapPosition: Position;
    public movementDirection: Direction;
    public movementState: number = 0.0;

    constructor(scene: Phaser.Scene, mapPosition: Position, movementDirection: Direction) {
        super(scene, 0, 0, 'tram_head');

        this.mapPosition = mapPosition;
        this.movementDirection = movementDirection;

        this.updateScale();
    }

    private updateScale(): void {
        this.setDisplaySize(CONST.tileSize * 0.6, CONST.tileSize * 0.6);
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
        this.tramSectionStates.push(new TramSectionState(scene, mapPosition, movementDirection))
        this.add(this.tramSectionStates[0]);
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
    }

    getTileCoordinates(): Array<number> {
        // Floating point coordinates in the tile coordinate system.
        return [this.x / CONST.tileSize - 0.5, this.y / CONST.tileSize - 0.5];
    }
}
