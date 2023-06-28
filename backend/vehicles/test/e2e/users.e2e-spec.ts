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
import * as constants from '../util/mocks/data/test-data.constants';
import { User } from '../../src/modules/company-user-management/users/entities/user.entity';

import { CompanyService } from '../../src/modules/company-user-management/company/company.service';
import { PendingUsersService } from '../../src/modules/company-user-management/pending-users/pending-users.service';
import {
  readRedCompanyAdminUserDtoMock,
  redCompanyAdminUserEntityMock,
  redCompanyCvClientUserEntityMock,
} from '../util/mocks/data/user.mock';
import { createMapper } from '@automapper/core';
import { UsersService } from '../../src/modules/company-user-management/users/users.service';
import { UsersController } from '../../src/modules/company-user-management/users/users.controller';
import { Role } from '../../src/common/enum/roles.enum';
import { IdirUser } from 'src/modules/company-user-management/users/entities/idir.user.entity';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-users/entities/pending-idir-user.entity';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import { PendingIdirUsersProfile } from 'src/modules/company-user-management/pending-idir-users/profiles/pending-idir-user.profile';

let repo: DeepMocked<Repository<User>>;
let repoIdirUser: DeepMocked<Repository<IdirUser>>;
let repoPendingIdirUser: DeepMocked<Repository<PendingIdirUser>>;
let pendingUsersServiceMock: DeepMocked<PendingUsersService>;
let pendingIdirUsersServiceMock: DeepMocked<PendingIdirUsersService>;
let companyServiceMock: DeepMocked<CompanyService>;

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<User>>();
    repoIdirUser = createMock<Repository<IdirUser>>();
    repoPendingIdirUser = createMock<Repository<PendingIdirUser>>();
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
          provide: getRepositoryToken(IdirUser),
          useValue: repoIdirUser,
        },
        {
          provide: getRepositoryToken(PendingIdirUser),
          useValue: repoPendingIdirUser,
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /*describe('/users/user-context GET', () => {
    it('should return the ORBC userContext.', async () => {
      repo.findOne.mockResolvedValue(redCompanyAdminUserEntityMock);
      repoIdirUser.findOne.mockResolvedValue(idirUserEntityMock);
      companyServiceMock.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      await request(app.getHttpServer()).get('/users/user-context').expect(200);
    });
  });*/

  describe('/users/roles?companyId=1 GET', () => {
    it('should return the ORBC userContext.', async () => {
      repo.query.mockResolvedValue([
        { ROLE_ID: Role.READ_SELF },
        { ROLE_ID: Role.READ_USER },
        { ROLE_ID: Role.WRITE_SELF },
        { ROLE_ID: Role.WRITE_USER },
      ]);

      const response = await request(app.getHttpServer())
        .get('/users/roles?companyId=1')
        .expect(200);
      expect(response.body).toContainEqual(Role.READ_SELF);
    });
  });

  describe('/users GETAll', () => {
    it('should return an array of company metadata associated with the users company.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([
            redCompanyAdminUserEntityMock,
            redCompanyCvClientUserEntityMock,
          ]),
        );

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toContainEqual(readRedCompanyAdminUserDtoMock);
    });
  });

  describe('/users/C23229C862234796BE9DA99F30A44F9A GETAll', () => {
    it('should return the user details.', async () => {
      jest
        .spyOn(repo, 'createQueryBuilder')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .mockImplementation(() =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createQueryBuilderMock([redCompanyAdminUserEntityMock]),
        );

      const response = await request(app.getHttpServer())
        .get('/users/' + constants.RED_COMPANY_ADMIN_USER_GUID)
        .expect(200);

      expect(response.body).toMatchObject(readRedCompanyAdminUserDtoMock);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
