import { CONST } from "../const";

export class Station extends Phaser.GameObjects.Container {
    static station_count: integer = 0;
    column: integer;
    row: integer;
    index: integer;
    station_name: string;

    station_tile: Phaser.GameObjects.Sprite;
    station_name_text: Phaser.GameObjects.Text;

    constructor(scene, params) {
        super(scene, params.x, params.y);
        this.column = params.column;
        this.row = params.row;
        this.station_name = params.station_name;
        this.index = Station.station_count++;

        this.station_tile = scene.add.sprite(0, 0, "station_tile");
        this.station_tile.setOrigin(0, 0);
        this.station_tile.setDisplaySize(CONST.tileSize, CONST.tileSize);
        this.add(this.station_tile);

        this.station_name_text = scene.add.text(0, 0, 'A');
        this.add(this.station_name_text);
    }

    isNearby(column: integer, row: integer): boolean {
        return Math.abs(column - this.column) + Math.abs(row - this.row) <= CONST.orderPickupDistance;
    }
}
