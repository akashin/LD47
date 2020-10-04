import { Direction, getDirectionDX, getDirectionDY } from "./direction";

export class Position {
    public x: integer;
    public y: integer;

    constructor(x: integer = 0, y: integer = 0) {
        this.x = x;
        this.y = y;
    }

    add(direction: Direction): Position {
        return new Position(this.x + getDirectionDX(direction), this.y + getDirectionDY(direction));
    }
}
