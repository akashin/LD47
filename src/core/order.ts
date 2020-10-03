import { randomInt } from "../utils/math";

export enum OrderStatus {
    offered,
    taken,
}

export class Order {
    public startPosX: integer;
    public startPosY: integer;
    public endPosX: integer;
    public endPosY: integer;
    public status: OrderStatus;

    // Creates Order objects.
    constructor(mapWidth: integer, mapHeight: integer) {
        this.startPosX = randomInt(mapWidth + 1);
        this.startPosY = randomInt(mapHeight + 1);
        this.endPosX = randomInt(mapWidth + 1);
        this.endPosY = randomInt(mapHeight + 1);
        this.status = OrderStatus.offered;
    }
}
