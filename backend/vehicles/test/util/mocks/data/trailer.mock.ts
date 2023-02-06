import { CreateTrailerDto } from '../../../../src/modules/vehicles/trailers/dto/request/create-trailer.dto';
import { UpdateTrailerDto } from '../../../../src/modules/vehicles/trailers/dto/request/update-trailer.dto';
import { ReadTrailerDto } from '../../../../src/modules/vehicles/trailers/dto/response/read-trailer.dto';
import { Trailer } from '../../../../src/modules/vehicles/trailers/entities/trailer.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';
import { provinceEntityMock } from './province.mock';
import { trailerTypeEntityMock } from './trailer-type.mock';

const TRAILER_ID = '1';
const UNIT_NUMBER = 'KEN1';
const PLATE = 'AS 5895';
const YEAR = 2010;
const MAKE = 'Kenworth';
const VIN = '1ZVFT80N475211367';
const EMPTY_TRAILER_WIDTH = 3.2;
const PROVINCE_ID = 'CA-BC';
const TRAILER_TYPE_CODE = 'BOOSTER';

export const trailerEntityMock: Trailer = {
  trailerId: TRAILER_ID,
  province: { ...provinceEntityMock },
  trailerType: { ...trailerTypeEntityMock },
  unitNumber: UNIT_NUMBER,
  plate: PLATE,
  year: YEAR,
  make: MAKE,
  vin: VIN,
  emptyTrailerWidth: EMPTY_TRAILER_WIDTH,
  ...baseEntityMock,
};

export const createTrailerDtoMock: CreateTrailerDto = {
  unitNumber: UNIT_NUMBER,
  plate: PLATE,
  year: YEAR,
  make: MAKE,
  vin: VIN,
  provinceId: PROVINCE_ID,
  trailerTypeCode: TRAILER_TYPE_CODE,
  emptyTrailerWidth: EMPTY_TRAILER_WIDTH,
};

export const updateTrailerDtoMock: UpdateTrailerDto = {
  ...createTrailerDtoMock,
  unitNumber: 'KEN2',
};

export const readTrailerDtoMock: ReadTrailerDto = {
  ...createTrailerDtoMock,
  trailerId: TRAILER_ID,
  createdDateTime: baseDtoMock.createdDateTime,
};
