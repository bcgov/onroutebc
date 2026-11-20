import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  createPendingIdirUserMock,
  readPendingIdirUserMock,
} from '../util/mocks/data/pending-idir-user.mock';
import { TestUserMiddleware } from './test-user.middleware';
import { redCompanyAdminUserJWTMock } from '../util/mocks/data/jwt.mock';
import { PendingIdirUsersController } from '@modules/company-user-management/pending-idir-users/pending-idir-users.controller';
import { PendingIdirUsersService } from '@modules/company-user-management/pending-idir-users/pending-idir-users.service';

let pendingIdirUsersService: DeepMocked<PendingIdirUsersService>;

describe('PendingUsers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    pendingIdirUsersService = createMock<PendingIdirUsersService>();
    pendingIdirUsersService.create.mockResolvedValue(readPendingIdirUserMock);
    const moduleFixture = await Test.createTestingModule({
      controllers: [PendingIdirUsersController],
      providers: [
        {
          provide: PendingIdirUsersService,
          useValue: pendingIdirUsersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    TestUserMiddleware.testUser = redCompanyAdminUserJWTMock;
    app.use(TestUserMiddleware.prototype.use.bind(TestUserMiddleware));
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('pending-idir-users CREATE', () => {
    it('should create a new pending idir User.', async () => {
      const response = await request(
        app.getHttpServer() as Parameters<typeof request>[0],
      )
        .post('/pending-idir-users')
        .send(createPendingIdirUserMock)
        .expect(201);
      expect(response.body).toMatchObject(readPendingIdirUserMock);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
