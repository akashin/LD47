import { CONST } from "../const";

export class Station extends Phaser.GameObjects.Sprite {
  column: integer;
  row: integer;

  constructor(scene, params) {
      super(scene, params.x, params.y, "station_tile");
      this.column = params.column;
      this.row = params.row;

      this.setOrigin(0, 0);
      this.setDisplaySize(CONST.tileSize, CONST.tileSize);
  }

  isNearby(column: integer, row: integer): boolean {
      return Math.abs(column - this.column) + Math.abs(row - this.row) < CONST.orderPickupDistance;
  }
}
