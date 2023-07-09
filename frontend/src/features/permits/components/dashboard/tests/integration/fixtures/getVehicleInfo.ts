import { factory, nullable, primaryKey } from "@mswjs/data";
import { PowerUnit, Trailer } from "../../../../../../manageVehicles/types/managevehicles";

let powerUnitId = 1;
let trailerId = 1;

const vehicleSourceDef = factory({
  powerUnit: {
    powerUnitId: primaryKey(() => `${powerUnitId++}` as string),
    companyId: Number,
    unitNumber: String,
    plate: String,
    year: nullable(Number),
    make: String,
    vin: String,
    licensedGvw: nullable(Number),
    steerAxleTireSize: nullable(Number),
    createdDateTime: nullable(String),
    updatedDateTime: nullable(String),
    provinceCode: String,
    countryCode: String,
    powerUnitTypeCode: String,
    vehicleType: () => "powerUnit",
  },
  trailer: {
    trailerId: primaryKey(() => `${trailerId++}` as string),
    companyId: Number,
    unitNumber: String,
    plate: String,
    year: nullable(Number),
    make: String,
    vin: String,
    emptyTrailerWidth: nullable(Number),
    createdDateTime: nullable(String),
    updatedDateTime: nullable(String),
    provinceCode: String,
    countryCode: String,
    trailerTypeCode: String,
    vehicleType: () => "trailer",
  },
  trailerType: {
    typeCode: primaryKey(String),
    type: String,
    description: String,
  },
  powerUnitType: {
    typeCode: primaryKey(String),
    type: String,
    description: String,
  },
});

export const getDefaultPowerUnits = () => ([
  {
    companyId: 74,
    unitNumber: "61",
    plate: "ABCDEF",
    year: 2001,
    make: "Freightliner",
    vin: "123456",
    licensedGvw: 15527,
    steerAxleTireSize: 330,
    createdDateTime: "2023-06-14T22:34:26.890Z",
    updatedDateTime: "2023-06-14T22:34:26.890Z",
    provinceCode: "BC",
    countryCode: "CA",
    powerUnitTypeCode: "PUTYPEB",
  },
]);

export const getDefaultTrailers = () => ([
  {
    companyId: 74,
    unitNumber: "3",
    plate: "A1B23C",
    year: 2014,
    make: "GMC",
    vin: "234567",
    emptyTrailerWidth: 3.7,
    createdDateTime: "2023-06-14T22:34:27.030Z",
    updatedDateTime: "2023-06-14T22:34:27.030Z",
    provinceCode: "OR",
    countryCode: "US",
    trailerTypeCode: "TRAILTC",
  },
]);

const getDefaultPowerUnitTypes = () => ([
  {
    typeCode: "PUTYPEA",
    type: "Power Unit Type A",
    description: "Power Unit Type A."
  },
  {
    typeCode: "PUTYPEB",
    type: "Power Unit Type B",
    description: "Power Unit Type B."
  },
  {
    typeCode: "PUTYPEC",
    type: "Power Unit Type C",
    description: "Power Unit Type C."
  },
]);

const getDefaultTrailerTypes = () => ([
  {
    typeCode: "TRAILTA",
    type: "Trailer Type A",
    description: "Trailer Type A."
  },
  {
    typeCode: "TRAILTB",
    type: "Trailer Type B",
    description: "Trailer Type B."
  },
  {
    typeCode: "TRAILTC",
    type: "Trailer Type C",
    description: "Trailer Type C."
  },
]);

export const createPowerUnit = (powerUnit: PowerUnit) => {
  return vehicleSourceDef.powerUnit.create({...powerUnit, powerUnitId: undefined});
};
export const updatePowerUnit = (powerUnitId: string, powerUnit: PowerUnit) => {
  return vehicleSourceDef.powerUnit.update({
    where: {
      powerUnitId: {
        equals: powerUnitId
      }
    },
    data: {
      ...powerUnit,
    }
  });
};
export const createTrailer = (trailer: Trailer) => {
  return vehicleSourceDef.trailer.create({...trailer, trailerId: undefined});
};
export const updateTrailer = (trailerId: string, trailer: Trailer) => {
  return vehicleSourceDef.trailer.update({
    where: {
      trailerId: {
        equals: trailerId
      }
    },
    data: {
      ...trailer,
    }
  });
};

const initVehicleSource = () => {
  getDefaultPowerUnitTypes().forEach((powerUnitType) => {
    vehicleSourceDef.powerUnitType.create(powerUnitType);
  });
  getDefaultTrailerTypes().forEach((trailerType) => {
    vehicleSourceDef.trailerType.create(trailerType);
  });
  getDefaultPowerUnits().forEach((powerUnit) => {
    createPowerUnit(powerUnit);
  });
  getDefaultTrailers().forEach((trailer) => {
    createTrailer(trailer);
  });
};

export const getAllPowerUnits = () => vehicleSourceDef.powerUnit.getAll();
export const getAllTrailers = () => vehicleSourceDef.trailer.getAll();
export const getAllPowerUnitTypes = () => vehicleSourceDef.powerUnitType.getAll();
export const getAllTrailerTypes = () => vehicleSourceDef.trailerType.getAll();

export const resetVehicleSource = () => {
  powerUnitId = 1;
  trailerId = 1;
  vehicleSourceDef.powerUnit.deleteMany({
    where: {
      powerUnitId: {
        contains: ""
      }
    }
  });
  vehicleSourceDef.trailer.deleteMany({
    where: {
      trailerId: {
        contains: ""
      }
    }
  });
  vehicleSourceDef.powerUnitType.deleteMany({
    where: {
      typeCode: {
        contains: ""
      }
    }
  });
  vehicleSourceDef.trailerType.deleteMany({
    where: {
      typeCode: {
        contains: ""
      }
    }
  });
  initVehicleSource();
};
