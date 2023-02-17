/* eslint-disable @typescript-eslint/require-await */
import { UpdateTrailerDto } from '../../../../src/modules/vehicles/trailers/dto/request/update-trailer.dto';
import { readTrailerDtoMock } from '../data/trailer.mock';

const TRAILER_ID_1 = '1';

export const trailersServiceMock = {
  create: jest.fn().mockResolvedValue(readTrailerDtoMock),
  findAll: jest.fn().mockResolvedValue([readTrailerDtoMock]),
  findOne: jest.fn(async (id: string) => {
    if (id === readTrailerDtoMock.trailerId) {
      return readTrailerDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (id: string, updateTrailerDtoMock: UpdateTrailerDto) => {
      if (id === TRAILER_ID_1) {
        Object.assign(readTrailerDtoMock, updateTrailerDtoMock);
        return readTrailerDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (id: string) => {
    if (id === TRAILER_ID_1) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
};
