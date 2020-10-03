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
    constructor(startPosX: integer, startPosY: integer, endPosX: integer, endPosY: integer) {
        this.startPosX = startPosX;
        this.startPosY = startPosY;
        this.endPosX = endPosX;
        this.endPosY = endPosY;
        this.status = OrderStatus.offered;
    }
}
