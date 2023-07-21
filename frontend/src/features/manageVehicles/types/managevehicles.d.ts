export type VehicleTypes = PowerUnit | Trailer;
export type VehicleTypesAsString = "powerUnit" | "trailer";

/**
 * A base vehicle type. This is an incomplete object and meant to be extended for use.
 */
interface Vehicle {
  unitNumber?: string;
  plate: string;
  provinceCode: string;
  countryCode: string;
  make: string;
  vin: string;
  year: number | null;
  createdDateTime?: string | null;
  updatedDateTime?: string | null;
  vehicleType?: VehicleTypesAsString;
}

export interface PowerUnit extends Vehicle {
  powerUnitId?: string;
  licensedGvw?: number;
  steerAxleTireSize?: number | null;
  powerUnitTypeCode: string;
}

export interface Trailer extends Vehicle {
  trailerId?: string;
  trailerTypeCode: string;
  emptyTrailerWidth?: number | null;
}

/**
 * Object type for power unit and trailer types.
 */
export interface VehicleType {
  typeCode: string;
  type: string;
  description: string;
}

/**
 * Object type for updating a power unit.
 * It is identical to CreatePowerUnit.
 */
export type UpdatePowerUnit = PowerUnit;

/**
 * Object type for updating a trailer.
 * It is identical to CreateTrailer.
 */
export type UpdateTrailer = Trailer;

/**
 * Enum indicating the options of axle front group.
 */
export enum AxleFrontGroup {
  Single = "Single",
  Tandem = "Tandem",
  Tridem = "Tridem",
}

/**
 * Enum indicating the types of axle.
 */
export enum AxleType {
  Steering = "Steering",
  Drive = "Drive",
}

/**
 * Object type for an axle group.
 */
export interface AxleGroup {
  axleFrontGroup: AxleFrontGroup;
  axleTypeFront: AxleType;
  axleTypeRear: AxleType;
  axleGroupNumber: number;
  axleGroupSpacing: number;
  interaxleSpreadFront: number;
  interaxleSpreadRear: number;
  numberOfTiresFront: number;
  numberOfTiresRear: number;
}
