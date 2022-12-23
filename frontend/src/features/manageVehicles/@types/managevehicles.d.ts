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

export interface IPowerUnitAPIResponse {
  data: Array<IPowerUnit>;
  /*meta: {
    totalRowCount: number;
  };
  */
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
  setPowerUnitData: Dispatch<SetStateAction<IPowerUnit[]>>;
  trailerData?: ITrailer[];

  // Table state
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolen>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolen>>;
  isRefetching: boolean;
  setIsRefetching: Dispatch<SetStateAction<boolen>>;
  rowCount: number;
  setRowCount: Dispatch<SetStateAction<number>>;

}
