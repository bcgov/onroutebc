import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DataSource, Repository } from 'typeorm';
import {
  MockQueryRunnerManager,
  createQueryBuilderMock,
} from '../util/mocks/factory/dataSource.factory.mock';
import { redCompanyAdminUserJWTMock } from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import * as constants from '../util/mocks/data/test-data.constants';
import { PendingUser } from '../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import {
  PENDING_USER_LIST,
  createRedCompanyPendingUserDtoMock,
  readRedCompanyPendingUserDtoMock,
  updateRedCompanyPendingUserDtoMock,
} from '../util/mocks/data/pending-user.mock';
import { ClientUserRole } from '../../src/common/enum/user-role.enum';
import { App } from 'supertest/types';
import { PendingUsersService } from '../../src/modules/company-user-management/pending-users/pending-users.service';
import { createMapper } from '@automapper/core';
import { PendingUsersController } from '../../src/modules/company-user-management/pending-users/pending-users.controller';
import { PendingUsersProfile } from '../../src/modules/company-user-management/pending-users/profiles/pending-user.profile';
import { redCompanyEntityMock } from '../util/mocks/data/company.mock';

interface SelectQueryBuilderParameters {
  userName?: string;
  companyId?: number;
}

let repo: DeepMocked<Repository<PendingUser>>;

describe('PendingUsers (e2e)', () => {
  let app: INestApplication<Express.Application>;
  const mockQueryRunnerManager: MockQueryRunnerManager = {
    delete: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<PendingUser>>();
    const moduleFixture = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        PendingUsersService,
        {
          provide: getRepositoryToken(PendingUser),
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
          useFactory: () => ({
            createQueryRunner: jest.fn().mockImplementation(() => ({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              release: jest.fn(),
              rollbackTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              query: jest.fn(),
              manager: mockQueryRunnerManager,
            })),
          }),
        },
        PendingUsersProfile,
      ],
      controllers: [PendingUsersController],
    }).compile();

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
      mockQueryRunnerManager.findOne.mockResolvedValue(redCompanyEntityMock);

      // Override the save method for this specific test
      mockQueryRunnerManager.save.mockResolvedValue(
        readRedCompanyPendingUserDtoMock,
      );
      const response = await request(app.getHttpServer() as unknown as App)
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

      const response = await request(app.getHttpServer() as unknown as App)
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

      const response = await request(app.getHttpServer() as unknown as App)
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

      const response = await request(app.getHttpServer() as unknown as App)
        .put(
          '/companies/1/pending-users/' +
            constants.RED_COMPANY_PENDING_USER_NAME,
        )
        .send(updateRedCompanyPendingUserDtoMock)
        .expect(200);

      expect(response.body).toMatchObject({
        ...readRedCompanyPendingUserDtoMock,
        userRole: ClientUserRole.PERMIT_APPLICANT,
      });
    });
  });

  afterAll(async () => {
    await app.close();
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
