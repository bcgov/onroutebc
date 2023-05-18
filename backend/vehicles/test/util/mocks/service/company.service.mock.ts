/* eslint-disable @typescript-eslint/require-await */
import { Directory } from '../../../../src/common/enum/directory.enum';
import { UpdateCompanyDto } from '../../../../src/modules/company-user-management/company/dto/request/update-company.dto';
import {
  readCompanyDtoMock,
  readCompanyMetadataDtoMock,
  readCompanyUserDtoMock,
} from '../data/company.mock';

export const companyServiceMock = {
  create: jest.fn().mockResolvedValue(readCompanyUserDtoMock),
  findAll: jest.fn().mockResolvedValue([readCompanyUserDtoMock]),
  findOne: jest.fn(async (companyId: number) => {
    if (companyId === 1) {
      return readCompanyDtoMock;
    } else {
      return null;
    }
  }),
  findCompanyMetadataByUserGuid: jest
    .fn()
    .mockResolvedValue([readCompanyMetadataDtoMock]),
  update: jest.fn(
    async (
      companyId: number,
      updateCompanyDtoMock: UpdateCompanyDto,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      directory?: Directory,
    ) => {
      if (companyId === 1) {
        Object.assign(readCompanyDtoMock, updateCompanyDtoMock);
        return readCompanyDtoMock;
      } else {
        return null;
      }
    },
  ),
};
