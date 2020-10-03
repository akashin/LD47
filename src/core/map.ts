import { CONST } from "../const";

export enum GroundType {
    Grass,
    Sand,
    Station,
}

export class Map {
    private ground: Array<Array<GroundType>>;

    constructor() {
        this.ground = new Array<Array<GroundType>>();

        for (let x = 0; x < CONST.mapWidth; ++x) {
            this.ground.push(new Array<GroundType>());
            for (let y = 0; y < CONST.mapHeight; ++y) {
                this.ground[x].push(GroundType.Grass);
            }
        }

        // Add stations.
        this.ground[10][10] = GroundType.Station;
        this.ground[10][100] = GroundType.Station;
        this.ground[100][10] = GroundType.Station;
        this.ground[100][100] = GroundType.Station;
    }


    getGroundType(x: integer, y: integer): GroundType {
        return this.ground[x][y];
    }
}
