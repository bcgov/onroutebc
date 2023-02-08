import { CreateTrailerTypeDto } from '../../../../src/modules/vehicles/trailer-types/dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from '../../../../src/modules/vehicles/trailer-types/dto/request/update-trailer-type.dto';
import { ReadTrailerTypeDto } from '../../../../src/modules/vehicles/trailer-types/dto/response/read-trailer-type.dto';
import { TrailerType } from '../../../../src/modules/vehicles/trailer-types/entities/trailer-type.entity';
import { baseEntityMock } from './base.mock';

const TYPE_CODE = 'BOOSTER';
const TYPE = 'Boosters';
const DESCRIPTION =
  'A Booster is similar to a jeep, but it is used behind a load.';
const SORT_ORDER = '1';
const IS_ACTIVE = '1;';

export const trailerTypeEntityMock: TrailerType = {
  typeCode: TYPE_CODE,
  type: TYPE,
  description: DESCRIPTION,
  sortOrder: SORT_ORDER,
  isActive: IS_ACTIVE,
  trailers: null,
  ...baseEntityMock,
};

export const readTrailerTypeDtoMock: ReadTrailerTypeDto = {
  typeCode: TYPE_CODE,
  type: TYPE,
  description: DESCRIPTION,
};

export const createTrailerTypeDtoMock: CreateTrailerTypeDto = {
  ...readTrailerTypeDtoMock,
  sortOrder: SORT_ORDER,
};

export const updateTrailerTypeDtoMock: UpdateTrailerTypeDto = {
  ...createTrailerTypeDtoMock,
  description: 'updated',
};
