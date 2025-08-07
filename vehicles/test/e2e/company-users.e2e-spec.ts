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
  redCompanyAdminUserEntityMock,
  updateRedCompanyCvClientUserDtoMock,
} from '../util/mocks/data/user.mock';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import { readRedCompanyPendingUserDtoMock } from 'test/util/mocks/data/pending-user.mock';
import { redCompanyEntityMock } from 'test/util/mocks/data/company.mock';
import { App } from 'supertest/types';
import * as constants from '../util/mocks/data/test-data.constants';
import { CompanyUser } from '../../src/modules/company-user-management/users/entities/company-user.entity';
import { Login } from '../../src/modules/company-user-management/users/entities/login.entity';

let repo: DeepMocked<Repository<User>>;
let repoCompanyUser: DeepMocked<Repository<CompanyUser>>;
let repoPendingIdirUser: DeepMocked<Repository<PendingIdirUser>>;
let repoLogin: DeepMocked<Repository<Login>>;
let pendingUsersServiceMock: DeepMocked<PendingUsersService>;
let pendingIdirUsersServiceMock: DeepMocked<PendingIdirUsersService>;
let companyServiceMock: DeepMocked<CompanyService>;

describe('Company Users (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<User>>();
    repoCompanyUser = createMock<Repository<CompanyUser>>();
    repoPendingIdirUser = createMock<Repository<PendingIdirUser>>();
    repoLogin = createMock<Repository<Login>>();
    pendingUsersServiceMock = createMock<PendingUsersService>();
    pendingIdirUsersServiceMock = createMock<PendingIdirUsersService>();
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
          provide: getRepositoryToken(PendingIdirUser),
          useValue: repoPendingIdirUser,
        },
        {
          provide: getRepositoryToken(Login),
          useValue: repoLogin,
        },
        {
          provide: getRepositoryToken(CompanyUser),
          useValue: repoCompanyUser,
        },
        {
          provide: PendingUsersService,
          useValue: pendingUsersServiceMock,
        },
        {
          provide: PendingIdirUsersService,
          useValue: pendingIdirUsersServiceMock,
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
    jest.clearAllMocks();
  });

  describe('/companies/1/users CREATE', () => {
    it('should create a new User.', async () => {
      jest
        .spyOn(pendingUsersServiceMock, 'findPendingUsersDto')
        .mockImplementation(() =>
          Promise.resolve([readRedCompanyPendingUserDtoMock]),
        );
      jest
        .spyOn(companyServiceMock, 'findOneByCompanyGuid')
        .mockReturnValue(Promise.resolve(redCompanyEntityMock));
      const response = await request(app.getHttpServer() as unknown as App)
        .post('/companies/1/users')
        .send(createRedCompanyAdminUserDtoMock)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
          userName: constants.RED_COMPANY_ADMIN_USER_NAME,
        }),
      );
    });
  });

  describe('/companies/1/users/C23229C862234796BE9DA99F30A44F9A UPDATE', () => {
    it('should update a User.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')

        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([redCompanyAdminUserEntityMock]),
        );

      const response = await request(app.getHttpServer() as unknown as App)
        .put('/companies/1/users/C23229C862234796BE9DA99F30A44F9A')
        .send(updateRedCompanyCvClientUserDtoMock)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
          userName: constants.RED_COMPANY_ADMIN_USER_NAME,
        }),
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
