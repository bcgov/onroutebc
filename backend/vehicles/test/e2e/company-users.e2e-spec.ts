import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DataSource, Repository } from 'typeorm';

import {
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../util/mocks/factory/dataSource.factory.mock';
import { redCompanyAdminUserJWTMock } from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import { AddressProfile } from '../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../src/modules/common/profiles/contact.profile';
import { UsersProfile } from '../../src/modules/company-user-management/users/profiles/user.profile';
import { User } from '../../src/modules/company-user-management/users/entities/user.entity';

import { CompanyService } from '../../src/modules/company-user-management/company/company.service';
import { PendingUsersService } from '../../src/modules/company-user-management/pending-users/pending-users.service';

import { createMapper } from '@automapper/core';
import { UsersService } from '../../src/modules/company-user-management/users/users.service';
import { CompanyUsersController } from '../../src/modules/company-user-management/users/company-users.controller';
import {
  createRedCompanyAdminUserDtoMock,
  readRedCompanyAdminUserDtoMock,
  redCompanyAdminUserEntityMock,
  updateRedCompanyAdminUserStatusDtoMock,
  updateRedCompanyCvClientUserDtoMock,
} from '../util/mocks/data/user.mock';
import { UserStatus } from '../../src/common/enum/user-status.enum';

let repo: DeepMocked<Repository<User>>;
let pendingUsersServiceMock: DeepMocked<PendingUsersService>;
let companyServiceMock: DeepMocked<CompanyService>;

describe('Company Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<User>>();
    pendingUsersServiceMock = createMock<PendingUsersService>();
    companyServiceMock = createMock<CompanyService>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: repo,
        },
        {
          provide: PendingUsersService,
          useValue: pendingUsersServiceMock,
        },
        {
          provide: CompanyService,
          useValue: companyServiceMock,
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
        ContactProfile,
        AddressProfile,
        UsersProfile,
      ],
      controllers: [CompanyUsersController],
    }).compile();

    app = moduleFixture.createNestApplication();
    TestUserMiddleware.testUser = redCompanyAdminUserJWTMock;
    app.use(TestUserMiddleware.prototype.use.bind(TestUserMiddleware));
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('/companies/1/users CREATE', () => {
    it('should create a new User.', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies/1/users')
        .send(createRedCompanyAdminUserDtoMock)
        .expect(201);
      expect(response.body).toMatchObject(readRedCompanyAdminUserDtoMock);
    });
  });

  describe('/companies/1/users/C23229C862234796BE9DA99F30A44F9A UPDATE', () => {
    it('should update a User.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([redCompanyAdminUserEntityMock]),
        );

      const response = await request(app.getHttpServer())
        .put('/companies/1/users/C23229C862234796BE9DA99F30A44F9A')
        .send(updateRedCompanyCvClientUserDtoMock)
        .expect(200);

      expect(response.body).toMatchObject(readRedCompanyAdminUserDtoMock);
    });
  });

  describe('/companies/1/users/C23229C862234796BE9DA99F30A44F9A/status UpdateStatus', () => {
    it('should update a User Status.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([
            {
              ...redCompanyAdminUserEntityMock,
              userStatus: UserStatus.DISABLED,
            },
          ]),
        );

      const response = await request(app.getHttpServer())
        .put('/companies/1/users/C23229C862234796BE9DA99F30A44F9A/status')
        .send(updateRedCompanyAdminUserStatusDtoMock)
        .expect(200);

      expect(response.body).toMatchObject({ statusUpdated: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
