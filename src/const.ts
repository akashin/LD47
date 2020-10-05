export let CONST = {
    tickDelta: 100,

    // Map
    mapWidth: 50,
    mapHeight: 50,
    tileSize: 48,

    // Stations.
    resourcePickupDistance: 1.1,

    // Inventory.
    inventoryX: 10,
    inventoryY: 600,
    inventorySize: 3,  // How many elements fits in the train.

    // How often we create a new demand.
    baseDemandPeriod: 100,
    // Min period with which new demand will be created.
    minDemandPeriod: 10,
    // The demand period is based on score and is equal:
    // period = baseDemandPeriod - score * scoreSpeedMultiplier
    scoreSpeedupMultiplier: 4,

    endGameThreshold: 5,

    // Train
    trainMinSpeed: 2,
    trainMaxSpeed: 10,
    trainGoodDistanceInTiles: 5,
    trainIgnoreDistanceInTiles: 1,
    trainCarriagesCount: 5,

    // Resources.
    resourceCount: 5,
}
