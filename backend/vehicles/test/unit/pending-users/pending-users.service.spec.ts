import { createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';
import { Repository } from 'typeorm';
import { PendingUser } from '../../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { PendingUsersProfile } from '../../../src/modules/company-user-management/pending-users/profiles/pending-user.profile';
import {
  createPendingUserDtoMock,
  updatePendingUserDtoMock,
  PENDING_USER_LIST,
} from '../../util/mocks/data/pending-user.mock';
import { createQueryBuilderMock } from '../../util/mocks/factory/dataSource.factory.mock';
import { UserAuthGroup } from '../../../src/common/enum/user-auth-group.enum';

const COMPANY_ID_1 = 1;
const USER_NAME_1 = 'ASMITH';
const USER_NAME_2 = 'JDOE';

interface SelectQueryBuilderParameters {
  userName?: string;
  companyId?: number;
}

describe('PendingUsersService', () => {
  let service: PendingUsersService;
  const repo = createMock<Repository<PendingUser>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        PendingUsersProfile,
      ],
    }).compile();

    service = module.get<PendingUsersService>(PendingUsersService);
  });

  it('Pending User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Pending user service create function', () => {
    it('should create a Pending user.', async () => {
      const PARAMS = { userName: USER_NAME_1, companyId: COMPANY_ID_1 };
      findPendingUsersEntityMock(PARAMS, repo);

      const retPendingUser = await service.create(
        COMPANY_ID_1,
        createPendingUserDtoMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Pending user service update function', () => {
    it('should update a Pending user.', async () => {
      const PARAMS = { userName: USER_NAME_2, companyId: COMPANY_ID_1 };
      PENDING_USER_LIST[1].userAuthGroup = UserAuthGroup.CV_CLIENT;
      findPendingUsersEntityMock(PARAMS, repo, PENDING_USER_LIST);

      const retPendingUser = await service.update(
        COMPANY_ID_1,
        USER_NAME_2,
        updatePendingUserDtoMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Pending user service findPendingUsersDto function', () => {
    it('should find a Pending user by User Name and Company Id.', async () => {
      const PARAMS = { userName: USER_NAME_1, companyId: COMPANY_ID_1 };
      findPendingUsersEntityMock(PARAMS, repo, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(
        USER_NAME_1,
        COMPANY_ID_1,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(COMPANY_ID_1);
    });
    it('should find a Pending user by User Name.', async () => {
      const params: SelectQueryBuilderParameters = { userName: USER_NAME_1 };
      findPendingUsersEntityMock(params, repo, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(USER_NAME_1);
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(COMPANY_ID_1);
    });
    it('should find all Pending users by Company Id.', async () => {
      const params: SelectQueryBuilderParameters = { companyId: COMPANY_ID_1 };
      findPendingUsersEntityMock(params, repo, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(
        null,
        COMPANY_ID_1,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(COMPANY_ID_1);
    });
    it('should find all Pending user,', async () => {
      const params: SelectQueryBuilderParameters = { companyId: COMPANY_ID_1 };
      findPendingUsersEntityMock(params, repo, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(null, null);
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Pending user service remove function', () => {
    it('should find delete a Pending user.', async () => {
      const deleteResult = await service.remove(COMPANY_ID_1, USER_NAME_1);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
function findPendingUsersEntityMock(
  params: SelectQueryBuilderParameters,
  repo,
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
