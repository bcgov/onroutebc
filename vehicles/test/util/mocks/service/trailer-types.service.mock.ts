/* eslint-disable @typescript-eslint/require-await */
import { UpdateTrailerTypeDto } from '../../../../src/modules/vehicles/trailer-types/dto/request/update-trailer-type.dto';
import { readTrailerTypeDtoMock } from '../data/trailer-type.mock';

const TYPE_CODE = 'BOOSTER';

export const trailerTypesServiceMock = {
  create: jest.fn().mockResolvedValue(readTrailerTypeDtoMock),
  findAll: jest.fn().mockResolvedValue([readTrailerTypeDtoMock]),
  findOne: jest.fn(async (typeCode: string) => {
    if (typeCode === readTrailerTypeDtoMock.typeCode) {
      return readTrailerTypeDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (
      typeCode: string,
      updateTrailerTypeDtoMock: UpdateTrailerTypeDto,
    ) => {
      if (typeCode === TYPE_CODE) {
        Object.assign(readTrailerTypeDtoMock, updateTrailerTypeDtoMock);
        return readTrailerTypeDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (typeCode: string) => {
    if (typeCode === TYPE_CODE) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
};
