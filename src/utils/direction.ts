export enum Direction {
    Up,
    Right,
    Down,
    Left,
}

export function getDirectionDX(direction: Direction) {
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

export function getDirectionDY(direction: Direction) {
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
