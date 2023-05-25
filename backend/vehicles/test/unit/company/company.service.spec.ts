/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { CompanyProfile } from '../../../src/modules/company-user-management/company/profiles/company.profile';
import { Company } from '../../../src/modules/company-user-management/company/entities/company.entity';
import { DataSource, Repository } from 'typeorm';
import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../../util/mocks/factory/dataSource.factory.mock';
import { UsersProfile } from '../../../src/modules/company-user-management/users/profiles/user.profile';
import { Directory } from '../../../src/common/enum/directory.enum';
import { AddressProfile } from '../../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../../src/modules/common/profiles/contact.profile';
import {
  COMPANY_LIST,
  blueCompanyEntityMock,
  createBlueCompanyDtoMock,
  createRedCompanyDtoMock,
  redCompanyEntityMock,
  updateRedCompanyDtoMock,
} from '../../util/mocks/data/company.mock';

import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { InternalServerErrorException } from '@nestjs/common';
import * as constants from '../../util/mocks/data/test-data.constants';
import {
  blueCompanyAdminUserJWTMock,
  redCompanyAdminUserJWTMock,
} from '../../util/mocks/data/jwt.mock';

const COMPANY_ID_99 = 99;
let repo: DeepMocked<Repository<Company>>;

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    jest.clearAllMocks();

    repo = createMock<Repository<Company>>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        CompanyProfile,
        ContactProfile,
        AddressProfile,
        UsersProfile,
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Company service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Company service create function', () => {
    it('should create a company registered in BC and its admin user.', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompanyUser = await service.create(
        createRedCompanyDtoMock,
        constants.RED_COMPANY_DIRECOTRY,
        redCompanyAdminUserJWTMock,
      );
      expect(typeof retCompanyUser).toBe('object');
      expect(retCompanyUser.companyId).toBe(constants.RED_COMPANY_ID);
    });

    it('should create a company registered in US and its admin user.', async () => {
      repo.findOne.mockResolvedValue(blueCompanyEntityMock);
      const retCompanyUser = await service.create(
        createBlueCompanyDtoMock,
        constants.BLUE_COMPANY_DIRECOTRY,
        blueCompanyAdminUserJWTMock,
      );
      expect(typeof retCompanyUser).toBe('object');
      expect(retCompanyUser.companyId).toBe(constants.BLUE_COMPANY_ID);
    });

    it('should catch and throw and Internal Error Exceptions user.', async () => {
      await expect(async () => {
        await service.create(null, null, redCompanyAdminUserJWTMock);
      }).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('Company service update function', () => {
    it('should update the company', async () => {
      repo.findOne
        .mockResolvedValueOnce(redCompanyEntityMock)
        .mockResolvedValueOnce({ ...redCompanyEntityMock, extension: null });
      repo.save.mockResolvedValue({
        ...redCompanyEntityMock,
        extension: 'null',
      });

      const retCompany = await service.update(
        constants.RED_COMPANY_ID,
        updateRedCompanyDtoMock,
        constants.RED_COMPANY_DIRECOTRY,
      );

      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
      expect(retCompany.extension).toBeNull();
    });

    it('should throw DataNotFound Exception', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(async () => {
        await service.update(
          COMPANY_ID_99,
          updateRedCompanyDtoMock,
          Directory.BBCEID,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Company service findOne function', () => {
    it('should return the Company', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findOne(constants.RED_COMPANY_ID);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Company service findCompanyMetadata function', () => {
    it('should return the Company Metadata', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findCompanyMetadata(
        constants.RED_COMPANY_ID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Company service findOneByCompanyGuid function', () => {
    it('should return the Company details', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findOneByCompanyGuid(
        constants.RED_COMPANY_GUID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Company service findCompanyMetadataByUserGuid function', () => {
    it('should return the Company Metadata List', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      const FILTERED_LIST = COMPANY_LIST.filter(
        (r) => r.companyUsers[0].user.userGUID === PARAMS.userGUID,
      );

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

      const retCompany = await service.findCompanyMetadataByUserGuid(
        constants.RED_COMPANY_ADMIN_USER_GUID,
      );

      expect(typeof retCompany).toBe('object');
      expect(retCompany[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
  });
});
