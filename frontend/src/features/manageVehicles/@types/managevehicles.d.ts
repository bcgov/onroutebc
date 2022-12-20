export interface IPowerUnit {
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

export interface ManageVehiclesContextType {
  powerUnitData: IPowerUnit[];
  trailerData?: ITrailer[]; // TODO
}
