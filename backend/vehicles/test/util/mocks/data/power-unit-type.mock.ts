import { CreatePowerUnitTypeDto } from '../../../../src/modules/power-unit-types/dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from '../../../../src/modules/power-unit-types/dto/request/update-power-unit-type.dto';
import { ReadPowerUnitTypeDto } from '../../../../src/modules/power-unit-types/dto/response/read-power-unit-type.dto';
import { PowerUnitType } from '../../../../src/modules/power-unit-types/entities/power-unit-type.entity';
import { baseEntityMock } from './base.mock';

const TYPE_CODE = 'CONCRET';
const TYPE = 'Concrete Pumper Trucks';
const DESCRIPTION =
  'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.';
const SORT_ORDER = '1';
const IS_ACTIVE = '1;';

export const powerUnitTypeEntityMock: PowerUnitType = {
  typeCode: TYPE_CODE,
  type: TYPE,
  description: DESCRIPTION,
  sortOrder: SORT_ORDER,
  isActive: IS_ACTIVE,
  powerUnits: null,
  ...baseEntityMock,
};

export const readPowerUnitTypeDtoMock: ReadPowerUnitTypeDto = {
  typeCode: TYPE_CODE,
  type: TYPE,
  description: DESCRIPTION,
};

export const createPowerUnitTypeDtoMock: CreatePowerUnitTypeDto = {
  ...readPowerUnitTypeDtoMock,
  sortOrder: SORT_ORDER,
};

export const updatePowerUnitTypeDtoMock: UpdatePowerUnitTypeDto = {
  ...createPowerUnitTypeDtoMock,
  description: 'updated',
};
