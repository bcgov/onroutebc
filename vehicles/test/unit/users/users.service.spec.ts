/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { DataSource, Repository } from 'typeorm';
import { AddressProfile } from '../../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../../src/modules/common/profiles/contact.profile';
import { User } from '../../../src/modules/company-user-management/users/entities/user.entity';
import { UsersProfile } from '../../../src/modules/company-user-management/users/profiles/user.profile';
import { UsersService } from '../../../src/modules/company-user-management/users/users.service';
import {
  MockQueryRunnerManager,
  createQueryBuilderMock,
} from '../../util/mocks/factory/dataSource.factory.mock';

import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';

import { BadRequestException } from '@nestjs/common';
import { Claim } from '../../../src/common/enum/claims.enum';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import * as constants from '../../util/mocks/data/test-data.constants';
import {
  readRedCompanyMetadataDtoMock,
  redCompanyEntityMock,
} from '../../util/mocks/data/company.mock';
import {
  USER_LIST,
  createRedCompanyCvClientUserDtoMock,
  redCompanyAdminUserEntityMock,
  redCompanyCvClientUserEntityMock,
  sysAdminStaffUserEntityMock,
  updateRedCompanyCvClientUserDtoMock,
} from '../../util/mocks/data/user.mock';
import {
  redCompanyAdminUserJWTMock,
  redCompanyCvClientUserJWTMock,
  redCompanyPendingUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../../util/mocks/data/jwt.mock';
import { readRedCompanyPendingUserDtoMock } from '../../util/mocks/data/pending-user.mock';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import { readPendingIdirUserMock } from 'test/util/mocks/data/pending-idir-user.mock';
import { Request } from 'express';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';
import { CompanyUser } from '../../../src/modules/company-user-management/users/entities/company-user.entity';
import { Login } from '../../../src/modules/company-user-management/users/entities/login.entity';

interface SelectQueryBuilderParameters {
  userGUID?: string;
  companyId?: number;
}

let repo: DeepMocked<Repository<User>>;
let repoCompanyUser: DeepMocked<Repository<CompanyUser>>;
let repoPendingIdirUser: DeepMocked<Repository<PendingIdirUser>>;
let repoLogin: DeepMocked<Repository<Login>>;
let pendingUsersServiceMock: DeepMocked<PendingUsersService>;
let pendingIdirUsersServiceMock: DeepMocked<PendingIdirUsersService>;
let companyServiceMock: DeepMocked<CompanyService>;

describe('UsersService', () => {
  let service: UsersService;

  const mockQueryRunnerManager: MockQueryRunnerManager = {
    delete: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    pendingUsersServiceMock = createMock<PendingUsersService>();
    pendingIdirUsersServiceMock = createMock<PendingIdirUsersService>();
    companyServiceMock = createMock<CompanyService>();
    repo = createMock<Repository<User>>();
    repoPendingIdirUser = createMock<Repository<PendingIdirUser>>();
    repoLogin = createMock<Repository<Login>>();
    repoCompanyUser = createMock<Repository<CompanyUser>>();

    const module: TestingModule = await Test.createTestingModule({
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
        ContactProfile,
        AddressProfile,
        UsersProfile,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User service getCompaniesForUser function', () => {
    it('should return the Associated Company List', async () => {
      companyServiceMock.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      const retCompanies = await service.getCompaniesForUser(
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
      );
      expect(typeof retCompanies).toBe('object');
      expect(retCompanies[0]).toBe(readRedCompanyMetadataDtoMock);
    });
  });

  describe('User service create function', () => {
    it('should create a user.', async () => {
      pendingUsersServiceMock.findPendingUsersDto.mockResolvedValue([
        readRedCompanyPendingUserDtoMock,
      ]);

      // Override the save method for this specific test
      mockQueryRunnerManager.save.mockResolvedValue(
        redCompanyCvClientUserEntityMock,
      );

      const retUser = await service.create(
        createRedCompanyCvClientUserDtoMock,
        constants.RED_COMPANY_ID,
        redCompanyCvClientUserJWTMock,
      );
      expect(typeof retUser).toBe('object');
      expect(retUser.userGUID).toBe(constants.RED_COMPANY_CVCLIENT_USER_GUID);
    });

    it('should catch and throw and Internal Error Exceptions user.', async () => {
      pendingUsersServiceMock.findPendingUsersDto.mockResolvedValue([]);
      await expect(async () => {
        await service.create(null, null, redCompanyCvClientUserJWTMock);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('User service update function', () => {
    it('should update the user', async () => {
      const params: SelectQueryBuilderParameters = {
        userGUID: constants.RED_COMPANY_CVCLIENT_USER_GUID,
      };
      USER_LIST[1].userContact.phone2 = null;
      USER_LIST[1].userContact.extension2 = null;

      findUsersEntityMock(params, USER_LIST);

      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;

      const retUser = await service.update(
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
        updateRedCompanyCvClientUserDtoMock,
        constants.RED_COMPANY_ID,
        request.user as IUserJWT,
      );

      expect(typeof retUser).toBe('object');
      expect(retUser.userGUID).toBe(constants.RED_COMPANY_CVCLIENT_USER_GUID);
      expect(retUser.phone2).toBeNull();
      expect(retUser.phone2Extension).toBeNull();
    });
    it('should throw DataNotFoundException', async () => {
      const params: SelectQueryBuilderParameters = {
        userGUID: '081BA455A00D4374B0CC130XXXXXXX',
      };
      findUsersEntityMock(params, USER_LIST);
      await expect(async () => {
        await service.update(
          constants.RED_COMPANY_CVCLIENT_USER_GUID,
          updateRedCompanyCvClientUserDtoMock,
          constants.RED_COMPANY_ID,
          undefined,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
    afterEach(() => {
      USER_LIST[1].userContact.phone2 = constants.RED_COMPANY_CVCLIENT_PHONE_2;
      USER_LIST[1].userContact.phone2 =
        constants.RED_COMPANY_CVCLIENT_PHONE_2_EXT;
    });
  });

  describe('User service getRolesForUser function', () => {
    it('should get the user Roles', async () => {
      repo.query.mockResolvedValue([
        { ROLE_TYPE: Claim.READ_SELF },
        { ROLE_TYPE: Claim.READ_USER },
        { ROLE_TYPE: Claim.WRITE_SELF },
        { ROLE_TYPE: Claim.WRITE_USER },
      ]);

      const retUserRoles = await service.getClaimsForUser(
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
        constants.RED_COMPANY_ID,
      );

      expect(typeof retUserRoles).toBe('object');
      expect(retUserRoles[0]).toBe(Claim.READ_SELF);
    });
  });

  describe('User service findORBCUser function', () => {
    it('should return the user-context when user exists', async () => {
      repo.findOne.mockResolvedValue(redCompanyAdminUserEntityMock);
      companyServiceMock.findCompanyMetadataByUserGuid.mockResolvedValue([
        readRedCompanyMetadataDtoMock,
      ]);
      const retUserContext = await service.findORBCUser(
        redCompanyAdminUserJWTMock,
      );
      expect(typeof retUserContext).toBe('object');
      expect(retUserContext.user.userGUID).toBe(
        constants.RED_COMPANY_ADMIN_USER_GUID,
      );
    });
    it('should return the context when user is a Pending user', async () => {
      repo.findOne.mockReturnValue(undefined);
      pendingUsersServiceMock.findPendingUsersDto.mockResolvedValue([
        readRedCompanyPendingUserDtoMock,
      ]);
      companyServiceMock.findCompanyMetadata.mockResolvedValue(
        readRedCompanyMetadataDtoMock,
      );

      companyServiceMock.findCompanyMetadata.mockResolvedValue(
        readRedCompanyMetadataDtoMock,
      );

      companyServiceMock.findOneCompanyWithAssociatedUsers.mockResolvedValue(
        redCompanyEntityMock,
      );

      const retUserContext = await service.findORBCUser(
        redCompanyPendingUserJWTMock,
      );

      expect(typeof retUserContext).toBe('object');
      expect(retUserContext.pendingCompanies[0].companyId).toBe(
        constants.RED_COMPANY_ID,
      );
    });
  });

  //check Idir user
  describe('User service validateAndCreateIdirUser function', () => {
    it('should create and return idir user', async () => {
      repo.findOne.mockResolvedValue(null);
      pendingIdirUsersServiceMock.findPendingIdirUser.mockResolvedValue(
        readPendingIdirUserMock,
      );
      // Override the save method for this specific test
      mockQueryRunnerManager.save.mockResolvedValue(
        sysAdminStaffUserEntityMock,
      );
      mockQueryRunnerManager.delete.mockResolvedValue(null);
      const userExists = await service.validateAndCreateIdirUser(
        sysAdminStaffUserJWTMock,
      );
      expect(typeof userExists).toBe('object');
      expect(userExists.user.userName).toBe(
        constants.SYS_ADMIN_STAFF_USER_NAME,
      );
    });
  });
});
function findUsersEntityMock(
  params: SelectQueryBuilderParameters,
  userList = USER_LIST,
) {
  const filteredList = userList.filter((r) => {
    const isMatchedUserGUID = params.userGUID
      ? r.userGUID === params.userGUID
      : true;
    const isMatchedCompanyId = params.companyId
      ? r.companyUsers[0].company.companyId === params.companyId
      : true;
    return isMatchedUserGUID && isMatchedCompanyId;
  });

  jest
    .spyOn(repo, 'createQueryBuilder')

    .mockImplementation(() => createQueryBuilderMock(filteredList));
}
