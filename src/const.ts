export let CONST = {
    tickDelta: 100,

    // Map
    mapWidth: 50,
    mapHeight: 50,
    tileSize: 48,

    // Stations.
    resourcePickupDistance: 1.4,

    // Inventory.
    inventoryX: 10,
    inventoryY: 700,
    inventorySize: 3,  // How many elements fits in the train.

    // How often we create a new demand.
    baseDemandPeriod: 100,
    // Min period with which new demand will be created.
    minDemandPeriod: 20,
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

    // Rating
    startingRating: 2.5,
    maxRating: 5,
    ratingIncreaseOnDeliveryMin: 0.15,
    ratingIncreaseOnDeliveryMax: 0.25,
    ratingDecreaseOnExpirationMin: 0.5,
    ratingDecreaseOnExpirationMax: 0.75,
    ratingDecreasePerSecond: 0.5,
}
