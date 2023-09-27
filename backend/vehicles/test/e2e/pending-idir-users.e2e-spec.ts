import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import {
  createPendingIdirUserMock,
  pendingIdirUserEntityMock,
  readPendingIdirUserMock,
} from 'test/util/mocks/data/pending-idir-user.mock';
import { PendingIdirUsersModule } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.module';
import { TestUserMiddleware } from './test-user.middleware';
import { redCompanyAdminUserJWTMock } from 'test/util/mocks/data/jwt.mock';

const repo = createMock<Repository<PendingIdirUser>>();

describe('PendingUsers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    const moduleFixture = await Test.createTestingModule({
      imports: [
        PendingIdirUsersModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(PendingIdirUser))
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

  describe('pending-idir-users CREATE', () => {
    it('should create a new pending idir User.', async () => {
      repo.save.mockResolvedValue(pendingIdirUserEntityMock);
      const response = await request(app.getHttpServer())
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
