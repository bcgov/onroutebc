export interface IPowerUnit {
  concurrencyControlNumber: null,
  createdUser: null,
  createdDateTime: null,
  updatedUser: null,
  updatedDateTime: null,
  powerUnitId: string,
  unitNumber: string,
  plateNumber: string,
  year: number,
  make: string,
  vin: string,
  licensedGvw: number,
  steerAxleTireSize: number
}

export interface ITrailer {
  id: number;
  unit: string;
  make: string;
  vin: string;
  plate: string;
  subtype: string;
  year: number;
  country: string;
  gvw: number;
  isActive: boolean;
  dateCreated: string;
}

export interface VehiclesContextType {
  powerUnitData: IPowerUnit[];
  trailerData?: ITrailer[];
}

/**
 * A base vehicle type. This is an incomplete object and meant to be extended for use.
 * Extended by: CreatePowerUnit, CreateTrailer
 */
 interface Vehicle {
  unitNumber: string;
  make: string;
  year: number;
  vin: string;
  plate: string;
}

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

/**
 * Object type for creating a power unit.
 */
export interface CreatePowerUnit extends Vehicle {
  powerUnitTypeCode: string;
  provinceId: string;
  licensedGvw: number;
  steerAxleTireSize: number;
  axleGroup?: AxleGroup;
  country?: string;
  province?: string;
}

/**
 * Object type for power unit types.
 */
export interface PowerUnitType {
  typeCode: string;
  type: string;
  description: string;
}

/**
 * Object type for updating a power unit.
 * It is identical to CreatePowerUnit.
 */
export type UpdatePowerUnit = CreatePowerUnit;

/**
 * Object type for creating or updating a trailer.
 */
export interface CreateTrailer extends Vehicle {
  trailerType: string;
  trailerSubType: string;
}

/**
 * Object type for updating a trailer.
 * It is identical to CreateTrailer.
 */
 export type UpdateTrailer = CreateTrailer;

