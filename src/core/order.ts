
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
        this.startPosX = Math.floor(Math.random() * (mapWidth + 1));
        this.startPosY = Math.floor(Math.random() * (mapHeight + 1));
        this.endPosX = Math.floor(Math.random() * (mapWidth + 1));
        this.endPosY = Math.floor(Math.random() * (mapHeight + 1));
        this.status = OrderStatus.offered;
    }
  }
