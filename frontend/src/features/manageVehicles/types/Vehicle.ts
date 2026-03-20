import { Nullable } from "../../../common/types/common";

export type Vehicle = PowerUnit | Trailer;

export const VEHICLE_TYPES = {
  POWER_UNIT: "powerUnit",
  TRAILER: "trailer",
} as const;

export type VehicleType = (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES];

export const DEFAULT_VEHICLE_TYPE = VEHICLE_TYPES.POWER_UNIT;

/**
 * Gets display text for vehicle type.
 * @param vehicleType Vehicle type (power unit or trailer)
 * @returns Display text for the vehicle type
 */
export const vehicleTypeDisplayText = (vehicleType: VehicleType) => {
  if (vehicleType === VEHICLE_TYPES.TRAILER) {
    return "Trailer";
  }
  return "Power Unit";
};

export const VEHICLE_TYPE_OPTIONS = [
  {
    value: VEHICLE_TYPES.POWER_UNIT,
    label: vehicleTypeDisplayText(VEHICLE_TYPES.POWER_UNIT),
  },
  {
    value: VEHICLE_TYPES.TRAILER,
    label: vehicleTypeDisplayText(VEHICLE_TYPES.TRAILER),
  },
];

/**
 * A base vehicle type. This is an incomplete object and meant to be extended for use.
 */
export interface BaseVehicle {
  unitNumber?: string;
  plate: string;
  provinceCode: string;
  countryCode: string;
  make: string;
  vin: string;
  year: Nullable<number>;
  createdDateTime?: Nullable<string>;
  updatedDateTime?: Nullable<string>;
  vehicleType?: VehicleType;
}

export interface PowerUnit extends BaseVehicle {
  powerUnitId?: string;
  licensedGvw?: Nullable<number>;
  steerAxleTireSize?: Nullable<number>;
  powerUnitTypeCode: string;
}

export interface Trailer extends BaseVehicle {
  trailerId?: string;
  trailerTypeCode: string;
  emptyTrailerWidth?: Nullable<number>;
}

/**
 * Object type for power unit and trailer subtypes.
 */
export interface VehicleSubType {
  typeCode: string;
  type: string;
  description: string;
}

/**
 * Request data type for creating a power unit.
 */
export type PowerUnitCreateData = PowerUnit;

/**
 * Request data type for creating a trailer.
 */
export type TrailerCreateData = Trailer;

/**
 * Request data type for updating a power unit.
 */
export type PowerUnitUpdateData = PowerUnit;

/**
 * Request data type for updating a trailer.
 */
export type TrailerUpdateData = Trailer;

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
