import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { CompanyController } from '../../../src/modules/company-user-management/company/company.controller';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { companyServiceMock } from '../../util/mocks/service/company.service.mock';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { getDirectory } from '../../../src/common/helper/auth.helper';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';
import { redCompanyAdminUserJWTMock } from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';
import {
  createRedCompanyDtoMock,
  readRedCompanyDtoMock,
} from '../../util/mocks/data/company.mock';

const COMPANY_ID_99 = 99;
describe('CompanyController', () => {
  let controller: CompanyController;
  const request = createMock<Request>();

  beforeEach(async () => {
    request.user = redCompanyAdminUserJWTMock; // TODO rework
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: companyServiceMock }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('Company Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Company controller create function', () => {
    it('should create a company', async () => {
      const currentUser = request.user as IUserJWT;
      const retCompany = await controller.create(
        request,
        createRedCompanyDtoMock,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toEqual(constants.RED_COMPANY_ID);
      expect(retCompany.mailingAddress).toEqual(
        readRedCompanyDtoMock.mailingAddress,
      );
      expect(companyServiceMock.create).toHaveBeenCalledWith(
        createRedCompanyDtoMock,
        getDirectory(currentUser),
        currentUser,
      );
    });
  });

  describe('Company controller get function', () => {
    it('should return the company', async () => {
      const retCompany = await controller.get(
        request,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany).toEqual(readRedCompanyDtoMock);
    });

    it('should throw a DataNotFoundException if company is not found', async () => {
      await expect(async () => {
        await controller.get(request, COMPANY_ID_99);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  //
  // describe('Company controller getCompanyMetadata function', () => {
  //   it('should return the company metadata when userGUID is provided', async () => {
  //     const retCompanyMetadata = await controller.getCompanyMetadata(
  //       request,
  //       constants.RED_COMPANY_ADMIN_USER_GUID,
  //     );
  //     expect(typeof retCompanyMetadata).toBe('object');
  //     expect(retCompanyMetadata).toContainEqual(readRedCompanyMetadataDtoMock);
  //     expect(retCompanyMetadata.length).toBe(1);
  //   });

  // it('should throw a DataNotFoundException if company is not found', async () => {
  //   await expect(async () => {
  //      await controller.getCompanyMetadata(request, USER_GUID_1);
  //   }).rejects.toThrow(DataNotFoundException);
  // });
  // });
});
