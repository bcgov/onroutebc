import { CreatePowerUnitDto } from '../../../../src/modules/vehicles/power-units/dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from '../../../../src/modules/vehicles/power-units/dto/request/update-power-unit.dto';
import { ReadPowerUnitDto } from '../../../../src/modules/vehicles/power-units/dto/response/read-power-unit.dto';
import { PowerUnit } from '../../../../src/modules/vehicles/power-units/entities/power-unit.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';
import { powerUnitTypeEntityMock } from './power-unit-type.mock';
import { provinceEntityMock } from './province.mock';

const POWER_UNIT_ID = '1';
const UNIT_NUMBER = 'KEN1';
const PLATE = 'AS 5895';
const YEAR = 2010;
const MAKE = 'Kenworth';
const VIN = '1ZVFT80N475211367';
const LICENSED_GVW = 35600;
const STEER_AXLE_TIRE_SIZE = 32;
const PROVINCE_ID = 'CA-BC';
const POWER_UNIT_TYPE_CODE = 'CONCRET';

export const powerUnitEntityMock: PowerUnit = {
  powerUnitId: POWER_UNIT_ID,
  province: { ...provinceEntityMock },
  powerUnitType: { ...powerUnitTypeEntityMock },
  unitNumber: UNIT_NUMBER,
  plate: PLATE,
  year: YEAR,
  make: MAKE,
  vin: VIN,
  licensedGvw: LICENSED_GVW,
  steerAxleTireSize: STEER_AXLE_TIRE_SIZE,
  ...baseEntityMock,
};

export const createPowerUnitDtoMock: CreatePowerUnitDto = {
  unitNumber: UNIT_NUMBER,
  plate: PLATE,
  year: YEAR,
  make: MAKE,
  vin: VIN,
  provinceId: PROVINCE_ID,
  powerUnitTypeCode: POWER_UNIT_TYPE_CODE,
  licensedGvw: LICENSED_GVW,
  steerAxleTireSize: STEER_AXLE_TIRE_SIZE,
};

export const updatePowerUnitDtoMock: UpdatePowerUnitDto = {
  ...createPowerUnitDtoMock,
  unitNumber: 'KEN2',
};

export const readPowerUnitDtoMock: ReadPowerUnitDto = {
  ...createPowerUnitDtoMock,
  powerUnitId: POWER_UNIT_ID,
  createdDateTime: baseDtoMock.createdDateTime,
};
