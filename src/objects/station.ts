import { CONST } from "../const";

export class Station extends Phaser.GameObjects.Sprite {
  private column: integer;
  private row: integer;

  constructor(scene, params) {
    super(scene, params.x, params.y, "station_tile");
    this.column = params.column;
    this.row = params.row;

    this.setOrigin(0, 0);
    this.setDisplaySize(CONST.tileSize, CONST.tileSize);
  }
}
