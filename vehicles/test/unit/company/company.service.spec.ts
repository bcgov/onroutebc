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
import * as constants from '../../util/mocks/data/test-data.constants';
import {
  blueCompanyAdminUserJWTMock,
  redCompanyAdminUserJWTMock,
  redCompanyCvClientUserJWTMock,
} from '../../util/mocks/data/jwt.mock';
import * as databaseHelper from 'src/common/helper/database.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BadRequestException } from '@nestjs/common';
import { GetCompanyQueryParamsDto } from '../../../src/modules/company-user-management/company/dto/request/queryParam/getCompany.query-params.dto';
import { DopsService } from '../../../src/modules/common/dops.service';

const COMPANY_ID_99 = 99;
let repo: DeepMocked<Repository<Company>>;
let dopsService: DeepMocked<DopsService>;
let cacheManager: DeepMocked<Cache>;

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    jest.clearAllMocks();

    repo = createMock<Repository<Company>>();
    dopsService = createMock<DopsService>();
    cacheManager = createMock<Cache>();
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
        { provide: DopsService, useValue: dopsService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
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
      jest.spyOn(service, 'findOneByCompanyGuid').mockResolvedValue(undefined);
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      dopsService.notificationWithDocumentsFromDops.mockResolvedValue({
        message: 'Notification sent successfully.',
        transactionId: '00000000-0000-0000-0000-000000000000',
      });

      jest
        .spyOn(databaseHelper, 'callDatabaseSequence')
        .mockImplementation(async () => {
          return Promise.resolve('000005');
        });
      const retCompanyUser = await service.create(
        createRedCompanyDtoMock,
        redCompanyAdminUserJWTMock,
      );
      expect(typeof retCompanyUser).toBe('object');
      expect(retCompanyUser.companyId).toBe(constants.RED_COMPANY_ID);
    });

    it('should create a company registered in US and its admin user.', async () => {
      jest.spyOn(service, 'findOneByCompanyGuid').mockResolvedValue(undefined);
      repo.findOne.mockResolvedValue(blueCompanyEntityMock);
      dopsService.notificationWithDocumentsFromDops.mockResolvedValue({
        message: 'Notification sent successfully.',
        transactionId: '00000000-0000-0000-0000-000000000000',
      });
      jest
        .spyOn(databaseHelper, 'callDatabaseSequence')
        .mockImplementation(async () => {
          return Promise.resolve('000006');
        });
      const retCompanyUser = await service.create(
        createBlueCompanyDtoMock,
        blueCompanyAdminUserJWTMock,
      );
      expect(typeof retCompanyUser).toBe('object');
      expect(retCompanyUser.companyId).toBe(constants.BLUE_COMPANY_ID);
    });

    it('should catch and throw and Internal Error Exceptions user.', async () => {
      await expect(async () => {
        await service.create(null, redCompanyAdminUserJWTMock);
      }).rejects.toThrow(BadRequestException);
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
        redCompanyCvClientUserJWTMock,
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
          redCompanyCvClientUserJWTMock,
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

  describe('Company service findCompanyPaginated function', () => {
    it('should return the Paginated Company List', async () => {
      const PARAMS = {
        pageOptionsDto: { page: 1, take: 10 },
        legalName: constants.RED_COMPANY_LEGAL_NAME,
        clientNumber: constants.RED_COMPANY_CLIENT_NUMBER,
      };
      const FILTERED_LIST = COMPANY_LIST.filter(
        (r) => r.legalName === PARAMS.legalName,
      ).filter((r) => r.clientNumber === PARAMS.clientNumber);

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

      const getCompanyQueryParamsDto: GetCompanyQueryParamsDto = {
        page: 1,
        take: 10,
        orderBy: 'companyId:DESC',
        clientNumber: 'Red Truck Inc',
        companyName: 'B3-000005-722',
      };

      const retCompanies = await service.findCompanyPaginated({
        page: getCompanyQueryParamsDto.page,
        take: getCompanyQueryParamsDto.take,
        orderBy: getCompanyQueryParamsDto.orderBy,
        companyName: getCompanyQueryParamsDto.companyName,
        clientNumber: getCompanyQueryParamsDto.clientNumber,
      });

      expect(typeof retCompanies).toBe('object');
      expect(retCompanies.items.length).toBeGreaterThan(0);
    });
  });
});
