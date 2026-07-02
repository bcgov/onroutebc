import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../../src/modules/company-user-management/company/entities/company.entity';
import {
  COMPANY_LIST,
  createRedCompanyDtoMock,
  readRedCompanyDtoMock,
  readRedCompanyMetadataDtoMock,
  redCompanyEntityMock,
  updateRedCompanyDtoMock,
} from '../util/mocks/data/company.mock';
import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../util/mocks/factory/dataSource.factory.mock';
import { redCompanyAdminUserJWTMock } from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import { AddressProfile } from '../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../src/modules/common/profiles/contact.profile';
import { CompanyProfile } from '../../src/modules/company-user-management/company/profiles/company.profile';
import { UsersProfile } from '../../src/modules/company-user-management/users/profiles/user.profile';
import * as constants from '../util/mocks/data/test-data.constants';
import * as databaseHelper from 'src/common/helper/database.helper';
import { Cache } from 'cache-manager';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { DopsService } from '../../src/modules/common/dops.service';
import { createMapper } from '@automapper/core';
import { CompanyController } from '../../src/modules/company-user-management/company/company.controller';
import { CompanyService } from '../../src/modules/company-user-management/company/company.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

let repo: DeepMocked<Repository<Company>>;
let dopsService: DeepMocked<DopsService>;
let cacheManager: DeepMocked<Cache>;

describe('Company (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<Company>>();
    dopsService = createMock<DopsService>();
    cacheManager = createMock<Cache>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const moduleFixture = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        CompanyService,
        CompanyProfile,
        ContactProfile,
        AddressProfile,
        UsersProfile,
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
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
        { provide: DopsService, useValue: dopsService },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
      controllers: [CompanyController],
    }).compile();

    app = moduleFixture.createNestApplication();
    TestUserMiddleware.testUser = redCompanyAdminUserJWTMock;
    app.use(TestUserMiddleware.prototype.use.bind(TestUserMiddleware));
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('/companies CREATE', () => {
    it('should create a new Company.', async () => {
      repo.findOne
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(redCompanyEntityMock);

      dopsService.notificationWithDocumentsFromDops.mockResolvedValue({
        message: 'Notification sent successfully.',
        transactionId: '00000000-0000-0000-0000-000000000000',
      });
      jest
        .spyOn(databaseHelper, 'callDatabaseSequence')
        .mockImplementation(async () => {
          return Promise.resolve('000005');
        });
      const response = await request(app.getHttpServer() as unknown as App)
        .post('/companies')
        .send(createRedCompanyDtoMock)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          companyId: constants.RED_COMPANY_ID,
          companyGUID: constants.RED_COMPANY_GUID,
        }),
      );
    });
  });

  describe('/companies GETAll', () => {
    it('should return an array of company metadata associated with the user', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      findCompanywithParams(PARAMS);

      const response = await request(app.getHttpServer() as unknown as App)
        .get('/companies/meta-data')
        .expect(200);

      expect(response.body).toContainEqual(readRedCompanyMetadataDtoMock);
    });
  });

  describe('/companies/1 PUT', () => {
    it('should update the company and return the latest value.', async () => {
      repo.findOne.mockResolvedValue({
        ...redCompanyEntityMock,
        extension: null,
      });
      const response = await request(app.getHttpServer() as unknown as App)
        .put('/companies/1')
        .send(updateRedCompanyDtoMock)
        .expect(200);

      expect(response.body).toMatchObject({
        ...readRedCompanyDtoMock,
        extension: null,
      });
    });
  });

  describe('/companies/1 GET', () => {
    it('should return a company with companyId as 1.', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const response = await request(app.getHttpServer() as unknown as App)
        .get('/companies/1')
        .expect(200);

      expect(response.body).toMatchObject(readRedCompanyDtoMock);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
function findCompanywithParams(PARAMS: { userGUID: string }) {
  const FILTERED_LIST = COMPANY_LIST.filter(
    (r) => r.companyUsers[0].user.userGUID === PARAMS.userGUID,
  );
  jest
    .spyOn(repo, 'createQueryBuilder')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));
}
