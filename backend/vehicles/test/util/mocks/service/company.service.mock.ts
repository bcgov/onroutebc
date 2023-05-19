/* eslint-disable @typescript-eslint/require-await */
import { Directory } from '../../../../src/common/enum/directory.enum';
import { UpdateCompanyDto } from '../../../../src/modules/company-user-management/company/dto/request/update-company.dto';
import {
  readRedCompanyDtoMock,
  readRedCompanyMetadataDtoMock,
  readRedCompanyUserDtoMock,
} from '../data/company.mock';
import { RED_COMPANY_ID } from '../data/test-data.constants';

export const companyServiceMock = {
  create: jest.fn().mockResolvedValue(readRedCompanyUserDtoMock),
  findOne: jest.fn(async (companyId: number) => {
    if (companyId === RED_COMPANY_ID) {
      return readRedCompanyDtoMock;
    } else {
      return null;
    }
  }),
  findCompanyMetadataByUserGuid: jest
    .fn()
    .mockResolvedValue([readRedCompanyMetadataDtoMock]),
  update: jest.fn(
    async (
      companyId: number,
      updateRedCompanyDtoMock: UpdateCompanyDto,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      directory?: Directory,
    ) => {
      if (companyId === RED_COMPANY_ID) {
        Object.assign(readRedCompanyDtoMock, updateRedCompanyDtoMock); // TODO Rework
        return readRedCompanyDtoMock;
      } else {
        return null;
      }
    },
  ),
};
