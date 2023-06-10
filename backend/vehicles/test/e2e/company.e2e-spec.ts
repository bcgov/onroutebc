import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DataSource, Repository } from 'typeorm';
import { Company } from '../../src/modules/company-user-management/company/entities/company.entity';
import { CompanyModule } from '../../src/modules/company-user-management/company/company.module';
import {
  COMPANY_LIST,
  createRedCompanyDtoMock,
  readRedCompanyDtoMock,
  readRedCompanyMetadataDtoMock,
  readRedCompanyUserDtoMock,
  redCompanyEntityMock,
  updateRedCompanyDtoMock,
} from '../util/mocks/data/company.mock';
import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../util/mocks/factory/dataSource.factory.mock';
import {
  redCompanyAdminUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import { AddressProfile } from '../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../src/modules/common/profiles/contact.profile';
import { CompanyProfile } from '../../src/modules/company-user-management/company/profiles/company.profile';
import { UsersProfile } from '../../src/modules/company-user-management/users/profiles/user.profile';
import * as constants from '../util/mocks/data/test-data.constants';
import * as databaseHelper from 'src/common/helper/database.helper';
import { randomInt } from 'crypto';

let repo: DeepMocked<Repository<Company>>;

describe('Company (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<Company>>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CompanyModule.forRoot(dataSourceMock),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [CompanyProfile, ContactProfile, AddressProfile, UsersProfile],
    })
      .overrideProvider(getRepositoryToken(Company))
      .useValue(repo)
      .compile();

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
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      jest
        .spyOn(databaseHelper, 'callDatabaseSequence')
        .mockImplementation(async () => {
          return Promise.resolve(
            String(randomInt(100, 10000)).padStart(6, '0'),
          );
        });
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(createRedCompanyDtoMock)
        .expect(201);
      expect(response.body).toMatchObject(readRedCompanyUserDtoMock);
    });
  });

  describe('/companies GETAll', () => {
    it('should return an array of company metadata associated with the user', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      findCompanywithParams(PARAMS);

      const response = await request(app.getHttpServer())
        .get('/companies')
        .expect(200);

      expect(response.body).toContainEqual(readRedCompanyMetadataDtoMock);
    });
    it('should throw a forbidden exception when user is not staff and userGUID is passed as Query Param', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      findCompanywithParams(PARAMS);

      TestUserMiddleware.testUser = redCompanyAdminUserJWTMock;

      await request(app.getHttpServer())
        .get('/companies?userGUID=' + constants.RED_COMPANY_ADMIN_USER_GUID)
        .expect(403);
    });
    it('should return an array of company metadata associated with the userGUID Query Param when logged in as Staff', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      findCompanywithParams(PARAMS);

      TestUserMiddleware.testUser = sysAdminStaffUserJWTMock;

      const response = await request(app.getHttpServer())
        .get('/companies?userGUID=' + constants.RED_COMPANY_ADMIN_USER_GUID)
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
      const response = await request(app.getHttpServer())
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
      const response = await request(app.getHttpServer())
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
