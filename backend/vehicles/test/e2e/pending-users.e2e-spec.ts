import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { createQueryBuilderMock } from '../util/mocks/factory/dataSource.factory.mock';
import { redCompanyAdminUserJWTMock } from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import * as constants from '../util/mocks/data/test-data.constants';
import { PendingUser } from '../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { PendingUsersModule } from '../../src/modules/company-user-management/pending-users/pending-users.module';
import { PendingUsersProfile } from '../../src/modules/company-user-management/pending-users/profiles/pending-user.profile';
import {
  PENDING_USER_LIST,
  createRedCompanyPendingUserDtoMock,
  readRedCompanyPendingUserDtoMock,
  updateRedCompanyPendingUserDtoMock,
} from '../util/mocks/data/pending-user.mock';
import { UserAuthGroup } from '../../src/common/enum/user-auth-group.enum';

interface SelectQueryBuilderParameters {
  userName?: string;
  companyId?: number;
}

let repo: DeepMocked<Repository<PendingUser>>;

describe('PendingUsers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<PendingUser>>();
    const moduleFixture = await Test.createTestingModule({
      imports: [
        PendingUsersModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [PendingUsersProfile],
    })
      .overrideProvider(getRepositoryToken(PendingUser))
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

  describe('companies/1/pending-users CREATE', () => {
    it('should create a new pending User.', async () => {
      const PARAMS = {
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(PARAMS);
      const response = await request(app.getHttpServer())
        .post('/companies/1/pending-users')
        .send(createRedCompanyPendingUserDtoMock)
        .expect(201);
      expect(response.body).toMatchObject(readRedCompanyPendingUserDtoMock);
    });
  });

  describe('companies/1/pending-users GETAll', () => {
    it('should return an array of pending Users', async () => {
      const PARAMS = {
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(PARAMS);

      const response = await request(app.getHttpServer())
        .get('/companies/1/pending-users')
        .expect(200);

      expect(response.body).toContainEqual(readRedCompanyPendingUserDtoMock);
    });
  });

  describe('companies/1/pending-users/FALONSO GET', () => {
    it('should return an array of pending Users', async () => {
      const PARAMS = {
        companyId: constants.RED_COMPANY_ID,
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
      };
      findPendingUsersEntityMock(PARAMS);

      const response = await request(app.getHttpServer())
        .get(
          '/companies/1/pending-users/' +
            constants.RED_COMPANY_PENDING_USER_NAME,
        )
        .expect(200);

      expect(response.body).toMatchObject(readRedCompanyPendingUserDtoMock);
    });
  });

  describe('companies/1/pending-users/FLONSO PUT', () => {
    it('should update a pending user and return the latest value.', async () => {
      const PARAMS = {
        companyId: constants.RED_COMPANY_ID,
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
      };
      findPendingUsersEntityMock(PARAMS);

      const response = await request(app.getHttpServer())
        .put(
          '/companies/1/pending-users/' +
            constants.RED_COMPANY_PENDING_USER_NAME,
        )
        .send(updateRedCompanyPendingUserDtoMock)
        .expect(200);

      expect(response.body).toMatchObject({
        ...readRedCompanyPendingUserDtoMock,
        userAuthGroup: UserAuthGroup.CV_CLIENT,
      });
    });
  });

  describe('companies/1/pending-users/FALONSO DEL', () => {
    it('should remove a pending User.', async () => {
      const PARAMS = {
        companyId: constants.RED_COMPANY_ID,
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
      };
      findPendingUsersEntityMock(PARAMS);

      const response = await request(app.getHttpServer())
        .delete(
          '/companies/1/pending-users/' +
            constants.RED_COMPANY_PENDING_USER_NAME,
        )
        .expect(200);

      expect(response.body).toMatchObject({ deleted: true });
    });
  });
});
function findPendingUsersEntityMock(
  params: SelectQueryBuilderParameters,
  pendingUserList = PENDING_USER_LIST,
) {
  const filteredList = pendingUserList.filter((r) => {
    const isMatchedUserName = params.userName
      ? r.userName === params.userName
      : true;
    const isMatchedCompanyId = params.companyId
      ? r.companyId === params.companyId
      : true;
    return isMatchedUserName && isMatchedCompanyId;
  });

  jest
    .spyOn(repo, 'createQueryBuilder')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .mockImplementation(() => createQueryBuilderMock(filteredList));
}
