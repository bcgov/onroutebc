/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createMock } from '@golevelup/ts-jest';
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
  MockType,
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../../util/mocks/factory/dataSource.factory.mock';

import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';
import { readCompanyMetadataDtoMock } from '../../util/mocks/data/company.mock';
import {
  USER_LIST,
  createUserDtoMock,
  currentUserMock,
  updateUserDtoMock,
} from '../../util/mocks/data/user.mock';
import { InternalServerErrorException } from '@nestjs/common';
import { Directory } from '../../../src/common/enum/directory.enum';
import { UserAuthGroup } from '../../../src/common/enum/user-auth-group.enum';
import { UserStatus } from '../../../src/common/enum/user-status.enum';
import { Role } from '../../../src/common/enum/roles.enum';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';

const COMPANY_ID_1 = 1;
const USER_GUID_1 = '06267945F2EB4E31B585932F78B76269';
const USER_GUID_2 = '081BA455A00D4374B0CC13092117A706';

interface SelectQueryBuilderParameters {
  userGUID?: string;
  companyId?: number;
}

describe('UsersService', () => {
  let service: UsersService;
  const pendingUsersServiceMock = createMock<PendingUsersService>();
  const companyServiceMock = createMock<CompanyService>();
  const repo = createMock<Repository<User>>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSourceMock: MockType<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useFactory: dataSourceMockFactory,
        },
        ContactProfile,
        AddressProfile,
        UsersProfile,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dataSourceMock = module.get(DataSource);
  });

  it('User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User service getCompaniesForUser function', () => {
    it('should return the Associated Company List', async () => {
      companyServiceMock.findCompanyMetadataByUserGuid.mockResolvedValue([
        readCompanyMetadataDtoMock,
      ]);
      const retCompanies = await service.getCompaniesForUser(USER_GUID_1);
      expect(typeof retCompanies).toBe('object');
      expect(retCompanies[0]).toBe(COMPANY_ID_1);
    });
  });

  describe('User service create function', () => {
    it('should create a user.', async () => {
      const retUser = await service.create(
        createUserDtoMock,
        COMPANY_ID_1,
        Directory.BBCEID,
        currentUserMock,
      );
      expect(typeof retUser).toBe('object');
      expect(retUser.userGUID).toBe(USER_GUID_1);
    });

    it('should catch and throw and Internal Error Exceptions user.', async () => {
      await expect(async () => {
        await service.create(
          null,
          COMPANY_ID_1,
          Directory.BBCEID,
          currentUserMock,
        );
      }).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('User service update function', () => {
    it('should update the user', async () => {
      const params: SelectQueryBuilderParameters = { userGUID: USER_GUID_2 };
      USER_LIST[1].userAuthGroup = UserAuthGroup.CV_CLIENT;
      findUsersEntityMock(params, repo, USER_LIST);

      const retUser = await service.update(USER_GUID_2, {
        ...updateUserDtoMock,
        userAuthGroup: UserAuthGroup.CV_CLIENT,
      });
      expect(typeof retUser).toBe('object');
      expect(retUser.userGUID).toBe(USER_GUID_2);
      expect(retUser.userAuthGroup).toEqual(UserAuthGroup.CV_CLIENT);
    });
    it('should throw DataNotFoundException', async () => {
      const params: SelectQueryBuilderParameters = {
        userGUID: '081BA455A00D4374B0CC130XXXXXXX',
      };
      findUsersEntityMock(params, repo, USER_LIST);
      await expect(async () => {
        await service.update(USER_GUID_2, {
          ...updateUserDtoMock,
          userAuthGroup: UserAuthGroup.CV_CLIENT,
        });
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('User service updateStatus function', () => {
    it('should update the user Status', async () => {
      repo.update.mockResolvedValue({
        affected: 1,
        raw: undefined,
        generatedMaps: undefined,
      });

      const retUpdateResult = await service.updateStatus(
        USER_GUID_2,
        UserStatus.DISABLED,
      );
      expect(typeof retUpdateResult).toBe('object');
      expect(retUpdateResult.affected).toBe(1);
    });
  });

  describe('User service getRolesForUser function', () => {
    it('should get the user Roles', async () => {
      repo.query.mockResolvedValue([
        { ROLE_ID: Role.READ_SELF },
        { ROLE_ID: Role.READ_USER },
        { ROLE_ID: Role.WRITE_SELF },
        { ROLE_ID: Role.WRITE_USER },
      ]);

      const retUserRoles = await service.getRolesForUser(
        USER_GUID_1,
        COMPANY_ID_1,
      );

      expect(typeof retUserRoles).toBe('object');
      expect(retUserRoles[0]).toBe(Role.READ_SELF);
    });
  });
});
function findUsersEntityMock(
  params: SelectQueryBuilderParameters,
  repo,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    .mockImplementation(() => createQueryBuilderMock(filteredList));
}
