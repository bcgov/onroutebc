interface Vehicle {
    unitNumber: string,
    make: string,
    year: string,
    vin: string,
    plateNumber: string
}

/**
 * 
 */
export enum AxleFrontGroup {
    Single = "Single",
    Tandem = "Tandem",
    Tridem = "Tridem"
}

/**
 * 
 */
export enum AxleType {
    Steering = "Steering",
    Drive = "Drive"
}

/**
 * 
 */
export interface AxleGroup {
    axleFrontGroup: AxleFrontGroup,
    axleTypeFront: AxleType,
    axleTypeRear: AxleType,
    axleGroupNumber: number,
    axleGroupSpacing: number,
    interaxleSpreadFront: number,
    interaxleSpreadRear: number,
    numberOfTiresFront: number,
    numberOfTiresRear: number,
}

/**
 * 
 */
export interface PowerUnit extends Vehicle {
    powerUnitType: string,
    country: string,
    province: string,
    licensedGvw: number,
    steerAxleTireSize: number,
    axleGroup: AxleGroup
}

/**
 * 
 */
 export interface Trailer extends Vehicle {
    trailerType: string,
    trailerSubType: string
}