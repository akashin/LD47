export enum GroundType {
    Grass,
}

export class Map {
    private static readonly WIDTH: integer = 20;
    private static readonly HEIGHT: integer = 20;

    private ground: Array<Array<GroundType>>;

    constructor() {
        this.ground = new Array<Array<GroundType>>();

        for (let x = 0; x < Map.WIDTH; ++x) {
            this.ground.push(new Array<GroundType>());
            for (let y = 0; y < Map.HEIGHT; ++y) {
                this.ground[x].push(GroundType.Grass);
            }
        }
    }

    groundType(x: integer, y: integer): GroundType {
        return this.ground[x][y];
    }
}
