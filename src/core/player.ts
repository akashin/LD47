import { CONST } from "../const";
import { Direction, getDirectionDX, getDirectionDY, getOppositeDirection, isDirectionHorizontal } from "../utils/direction";
import { Position } from "../utils/position";
import { GameMap, getAnotherEndDirection } from "./map";

enum TramSectionType {
    Head,
    Carriage,
}

class TramSection extends Phaser.GameObjects.Sprite {
    public tramSectionType: TramSectionType;
    public mapPosition: Position;
    public movementDirection: Direction;
    public movementState: number = 0.0;

    private static getTextureName(movementDirection: Direction, tramSectionType: TramSectionType): string {
        if (isDirectionHorizontal(movementDirection)) {
            if (tramSectionType == TramSectionType.Head) {
                return 'tram_head_horizontal';
            } else {
                return 'tram_carriage_horizontal';
            }
        } else {
            if (tramSectionType == TramSectionType.Head) {
                return 'tram_head_vertical';
            } else {
                return 'tram_carriage_vertical';
            }
        }
    }

    constructor(scene: Phaser.Scene, mapPosition: Position, movementDirection: Direction, tramSectionType: TramSectionType) {
        super(scene, 0, 0, TramSection.getTextureName(movementDirection, tramSectionType));

        this.tramSectionType = tramSectionType;
        this.mapPosition = mapPosition;
        this.movementDirection = movementDirection;

        this.updateScale();
    }

    private updateScale(): void {
        this.setDisplaySize(CONST.tileSize, CONST.tileSize);
    }

    update(): void {
        this.setTexture(TramSection.getTextureName(this.movementDirection, this.tramSectionType));
        switch (this.movementDirection) {
            case Direction.Up:
                this.setFlip(false, true);
                break;
            case Direction.Right:
                this.setFlip(true, false);
                break;
            case Direction.Down:
                this.setFlip(true, false);
                break;
            case Direction.Left:
                this.setFlip(false, false);
                break;
        }
        this.updateScale();
    }
}

export class Player extends Phaser.GameObjects.Container {
    private gameMap: GameMap;
    private tramSections: Array<TramSection>;

    constructor(
        scene: Phaser.Scene,
        gameMap: GameMap,
        mapPosition: Position,
        movementDirection: Direction
    ) {
        super(scene, (mapPosition.x + 0.5) * CONST.tileSize, (mapPosition.y + 0.5) * CONST.tileSize);
        this.gameMap = gameMap;

        this.tramSections = new Array<TramSection>();
        for (let i = 0; i < 1 + CONST.trainCarriagesCount; ++i) {
            let tramSectionType = i == 0 ? TramSectionType.Head : TramSectionType.Carriage;
            let tramSection = new TramSection(scene, mapPosition, movementDirection, tramSectionType);
            this.tramSections.push(tramSection)
            this.add(tramSection);

            let railType = this.gameMap.getRailType(mapPosition.x, mapPosition.y);
            let backwardDirection = getAnotherEndDirection(railType, getOppositeDirection(movementDirection));
            mapPosition = mapPosition.add(backwardDirection);
            movementDirection = getOppositeDirection(backwardDirection);
        }
        this.reverse();
    }

    update(delta: number, distanceToNearestStation: number): void {
        let goodDistance = CONST.trainGoodDistanceInTiles * CONST.tileSize;
        let ignoreDistance = CONST.trainIgnoreDistanceInTiles * CONST.tileSize;

        let distance = Math.min(distanceToNearestStation, goodDistance);
        distance = Math.max(distance, ignoreDistance);

        let ratio = distance / goodDistance;
        let speed = CONST.trainMinSpeed + (CONST.trainMaxSpeed - CONST.trainMinSpeed) * ratio;

        for (let section of this.tramSections) {
            section.movementState += delta / 1000.0 * speed;
            if (section.movementState >= 1.0) {
                section.movementState -= 1.0;

                section.mapPosition = section.mapPosition.add(section.movementDirection);

                let railType = this.gameMap.getRailType(section.mapPosition.x, section.mapPosition.y);
                section.movementDirection = getAnotherEndDirection(railType, section.movementDirection);

                section.update();
            }
        }

        {
            let headSection = this.tramSections[0];

            let dx = getDirectionDX(headSection.movementDirection) * headSection.movementState;
            let dy = getDirectionDY(headSection.movementDirection) * headSection.movementState;
            this.setPosition(
                (headSection.mapPosition.x + dx + 0.5) * CONST.tileSize,
                (headSection.mapPosition.y + dy + 0.5) * CONST.tileSize
            );
        }

        for (let section of this.tramSections) {
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
