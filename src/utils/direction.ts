export enum Direction {
    Up,
    Right,
    Down,
    Left,
}

export function getDirectionDX(direction: Direction): integer {
    switch (direction) {
        case Direction.Up:
            return 0;
        case Direction.Right:
            return 1;
        case Direction.Down:
            return 0;
        case Direction.Left:
            return -1;
    }
}

export function getDirectionDY(direction: Direction): integer {
    switch (direction) {
        case Direction.Up:
            return -1;
        case Direction.Right:
            return 0;
        case Direction.Down:
            return 1;
        case Direction.Left:
            return 0;
    }
}

export function getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
        case Direction.Up:
            return Direction.Down;
        case Direction.Right:
            return Direction.Left;
        case Direction.Down:
            return Direction.Up;
        case Direction.Left:
            return Direction.Right;
    }
}
