/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { CompanyController } from '../../../src/modules/company-user-management/company/company.controller';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { getDirectory } from '../../../src/common/helper/auth.helper';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';
import {
  redCompanyAdminUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';
import {
  createRedCompanyDtoMock,
  readRedCompanyDtoMock,
  readRedCompanyMetadataDtoMock,
  readRedCompanyUserDtoMock,
  updateRedCompanyDtoMock,
} from '../../util/mocks/data/company.mock';

const COMPANY_ID_99 = 99;
let companyService: DeepMocked<CompanyService>;

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    jest.clearAllMocks();
    companyService = createMock<CompanyService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: companyService }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Company Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Company controller create function', () => {
    it('should create a company', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      const currentUser = request.user as IUserJWT;
      companyService.create.mockResolvedValue(readRedCompanyUserDtoMock);
      const retCompany = await controller.create(
        request,
        createRedCompanyDtoMock,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toEqual(constants.RED_COMPANY_ID);
      expect(retCompany.mailingAddress).toEqual(
        readRedCompanyDtoMock.mailingAddress,
      );
      expect(companyService.create).toHaveBeenCalledWith(
        createRedCompanyDtoMock,
        getDirectory(currentUser),
        currentUser,
      );
    });
  });

  describe('Company controller get function', () => {
    it('should return the company', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      companyService.findOne.mockResolvedValue(readRedCompanyDtoMock);
      const retCompany = await controller.get(
        request,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany).toEqual(readRedCompanyDtoMock);
    });

    it('should throw a DataNotFoundException if company is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      companyService.findOne.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.get(request, COMPANY_ID_99);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Company controller getCompanyMetadata function', () => {
    it('should return the company metadata when userGUID is not provided', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      companyService.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      const retCompanyMetadata = await controller.getCompanyMetadata(request);
      expect(typeof retCompanyMetadata).toBe('object');
      expect(retCompanyMetadata).toContainEqual(readRedCompanyMetadataDtoMock);
      expect(retCompanyMetadata.length).toBe(1);
    });

    it('should return the company metadata when userGUID is provided', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      companyService.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      const retCompanyMetadata = await controller.getCompanyMetadata(
        request,
        constants.RED_COMPANY_ADMIN_USER_GUID,
      );
      expect(typeof retCompanyMetadata).toBe('object');
      expect(retCompanyMetadata).toContainEqual(readRedCompanyMetadataDtoMock);
      expect(retCompanyMetadata.length).toBe(1);
    });

    it('should throw a DataNotFoundException if company is not found', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      companyService.findCompanyMetadataByUserGuid.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.getCompanyMetadata(
          request,
          'CC7C7C0CB561437E98CB71A6B1036517',
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Company controller update function', () => {
    it('should update the Company', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      companyService.update.mockResolvedValue({
        ...readRedCompanyDtoMock,
        extension: null,
      });
      const retCompany = await controller.update(
        request,
        constants.RED_COMPANY_ID,
        updateRedCompanyDtoMock,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.extension).toBeNull();
    });
    it('should throw a DataNotFoundException if company is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      companyService.update.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.update(
          request,
          COMPANY_ID_99,
          updateRedCompanyDtoMock,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
