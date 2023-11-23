/* eslint-disable @typescript-eslint/require-await */
import { UpdateTrailerDto } from '../../../../src/modules/vehicles/trailers/dto/request/update-trailer.dto';
import { deleteDtoMock } from '../data/delete-dto.mock';
import { readTrailerDtoMock } from '../data/trailer.mock';

const COMPANY_ID_1 = 1;
const TRAILER_ID_1 = '1';

export const trailersServiceMock = {
  create: jest.fn().mockResolvedValue(readTrailerDtoMock),
  findAll: jest.fn().mockResolvedValue([readTrailerDtoMock]),
  findOne: jest.fn(async (companyId: number, id: string) => {
    if (
      ((companyId && companyId === COMPANY_ID_1) || !companyId) &&
      id === readTrailerDtoMock.trailerId
    ) {
      return readTrailerDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (
      companyId: number,
      id: string,
      updateTrailerDtoMock: UpdateTrailerDto,
    ) => {
      if (companyId === COMPANY_ID_1 && id === TRAILER_ID_1) {
        Object.assign(readTrailerDtoMock, updateTrailerDtoMock);
        return readTrailerDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (companyId: number, id: string) => {
    if (companyId === COMPANY_ID_1 && id === TRAILER_ID_1) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
  removeAll: jest.fn(async (trailerIds: string[], companyId: number) => {
    if (
      trailerIds.length == 1 &&
      trailerIds[0] == TRAILER_ID_1 &&
      companyId === COMPANY_ID_1
    ) {
      return deleteDtoMock;
    } else {
      return null;
    }
  }),
};
