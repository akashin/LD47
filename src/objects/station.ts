import { CONST } from "../const";

export class Station extends Phaser.GameObjects.Sprite {
    static station_count: integer = 0;
    column: integer;
    row: integer;
    index: integer;

    constructor(scene, params) {
        super(scene, params.x, params.y, "station_tile");
        this.column = params.column;
        this.row = params.row;
        this.index = Station.station_count++;

        this.setOrigin(0, 0);
        this.setDisplaySize(CONST.tileSize, CONST.tileSize);
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }
}
