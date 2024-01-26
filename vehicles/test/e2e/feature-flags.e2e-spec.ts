import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DataSource, Repository } from 'typeorm';
import {
  readRedCompanyMetadataDtoMock,
} from '../util/mocks/data/company.mock';
import {
  dataSourceMockFactory,
} from '../util/mocks/factory/dataSource.factory.mock';
import {
  redCompanyAdminUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import * as constants from '../util/mocks/data/test-data.constants';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { FeatureFlag } from 'src/modules/feature-flags/entities/feature-flag.entity';
import { FeatureFlagsModule } from 'src/modules/feature-flags/feature-flags.module';

let repo: DeepMocked<Repository<FeatureFlag>>;
let cacheManager: DeepMocked<Cache>;
let httpService: DeepMocked<HttpService>;

describe('FeatureFlags (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<FeatureFlag>>();
    cacheManager = createMock<Cache>();
    httpService = createMock<HttpService>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const moduleFixture = await Test.createTestingModule({
      imports: [
        FeatureFlagsModule.forRoot(dataSourceMock, cacheManager),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
      ],
    })
      .overrideProvider(getRepositoryToken(FeatureFlag))
      .useValue(repo)
      .compile();

    app = moduleFixture.createNestApplication();
    TestUserMiddleware.testUser = sysAdminStaffUserJWTMock;
    app.use(TestUserMiddleware.prototype.use.bind(TestUserMiddleware));
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('/feature-flags GETAll', () => {
    it('should return an array of feature flags', async () => {

      //TestUserMiddleware.testUser = sysAdminStaffUserJWTMock;

      const response = await request(app.getHttpServer() as unknown as App)
        .get('/feature-flags')
        .expect(200);

      console.log('response', response)

      //expect(response.body).toContainEqual(readRedCompanyMetadataDtoMock);
    });
    it('should throw a forbidden exception when user is not READ_ORG and userGUID is passed as Query Param', async () => {

      await request(app.getHttpServer() as unknown as App)
        .get('/feature-flags')
        .expect(403);
    });
  });
  
  afterAll(async () => {
    await app.close();
  });
});
