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
import {
  redCompanyAdminUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../util/mocks/data/jwt.mock';
import { TestUserMiddleware } from './test-user.middleware';
import { AddressProfile } from '../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../src/modules/common/profiles/contact.profile';
import { UsersProfile } from '../../src/modules/company-user-management/users/profiles/user.profile';
import * as constants from '../util/mocks/data/test-data.constants';
import { User } from '../../src/modules/company-user-management/users/entities/user.entity';

import { CompanyService } from '../../src/modules/company-user-management/company/company.service';
import { PendingUsersService } from '../../src/modules/company-user-management/pending-users/pending-users.service';
import {
  sysAdminStaffUserEntityMock,
  redCompanyAdminUserEntityMock,
} from '../util/mocks/data/user.mock';
import { createMapper } from '@automapper/core';
import { UsersService } from '../../src/modules/company-user-management/users/users.service';
import { UsersController } from '../../src/modules/company-user-management/users/users.controller';
import { Claim } from '../../src/common/enum/claims.enum';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import { PendingIdirUsersProfile } from 'src/modules/company-user-management/pending-idir-users/profiles/pending-idir-user.profile';
import { readRedCompanyMetadataDtoMock } from 'test/util/mocks/data/company.mock';
import { App } from 'supertest/types';
import { CompanyUser } from '../../src/modules/company-user-management/users/entities/company-user.entity';
import { Login } from '../../src/modules/company-user-management/users/entities/login.entity';

let repo: DeepMocked<Repository<User>>;
let repoCompanyUser: DeepMocked<Repository<CompanyUser>>;
let repoPendingIdirUser: DeepMocked<Repository<PendingIdirUser>>;
let repoLogin: DeepMocked<Repository<Login>>;
let pendingUsersServiceMock: DeepMocked<PendingUsersService>;
let pendingIdirUsersServiceMock: DeepMocked<PendingIdirUsersService>;
let companyServiceMock: DeepMocked<CompanyService>;

describe('Users (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeEach(async () => {
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
        PendingIdirUsersProfile,
      ],
      controllers: [UsersController],
    }).compile();

    app = moduleFixture.createNestApplication();
    TestUserMiddleware.testUser = redCompanyAdminUserJWTMock;
    app.use(TestUserMiddleware.prototype.use.bind(TestUserMiddleware));
    await app.init();
  });

  describe('/users/user-context POST', () => {
    it('should return the ORBC userContext.', async () => {
      repo.findOne.mockResolvedValue(redCompanyAdminUserEntityMock);
      companyServiceMock.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      await request(app.getHttpServer() as unknown as App)
        .post('/users/user-context')
        .expect(201);
    });
    it('should return the  ORBC IDIR userContext.', async () => {
      TestUserMiddleware.testUser = sysAdminStaffUserJWTMock;
      repo.findOne.mockResolvedValue(sysAdminStaffUserEntityMock);
      await request(app.getHttpServer() as unknown as App)
        .post('/users/user-context')
        .expect(201);
    });
  });

  describe('/users/claims?companyId=1 GET', () => {
    it('should return the ORBC userContext.', async () => {
      repo.query.mockResolvedValue([
        { ROLE_TYPE: Claim.READ_SELF },
        { ROLE_TYPE: Claim.READ_USER },
        { ROLE_TYPE: Claim.WRITE_SELF },
        { ROLE_TYPE: Claim.WRITE_USER },
      ]);

      const response = await request(app.getHttpServer() as unknown as App)
        .get('/users/claims?companyId=1')
        .expect(200);
      expect(response.body).toContainEqual(Claim.READ_SELF);
    });
  });

  // describe('/users GETAll', () => {
  //   it('should return list of IDIR users', async () => {
  //     jest
  //       .spyOn(repo, 'createQueryBuilder')
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //       .mockImplementation(() =>
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //         createQueryBuilderMock([sysAdminStaffUserEntityMock]),
  //       );

  //     const response = await request(app.getHttpServer() as unknown as App)
  //       .get('/users')
  //       .expect(200);

  //     expect(response.body).toContainEqual([readSysAdminStaffUserDtoMock]);
  //   });
  // });

  describe('/users/C23229C862234796BE9DA99F30A44F9A GETAll', () => {
    it('should return the user details.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([redCompanyAdminUserEntityMock]),
        );

      const response = await request(app.getHttpServer() as unknown as App)
        .get('/users/' + constants.RED_COMPANY_ADMIN_USER_GUID)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
          userName: constants.RED_COMPANY_ADMIN_USER_NAME,
        }),
      );
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
