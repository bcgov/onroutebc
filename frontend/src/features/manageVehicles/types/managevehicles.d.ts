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
