import { DeepMocked, createMock } from '@golevelup/ts-jest';
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
  PENDING_USER_LIST,
  createRedCompanyPendingUserDtoMock,
  updateRedCompanyPendingUserDtoMock,
} from '../../util/mocks/data/pending-user.mock';
import { createQueryBuilderMock } from '../../util/mocks/factory/dataSource.factory.mock';
import { UserAuthGroup } from '../../../src/common/enum/user-auth-group.enum';
import * as constants from '../../util/mocks/data/test-data.constants';
import { redCompanyCvClientUserJWTMock } from 'test/util/mocks/data/jwt.mock';
import { getDirectory } from 'src/common/helper/auth.helper';

interface SelectQueryBuilderParameters {
  userName?: string;
  companyId?: number;
}

let repo: DeepMocked<Repository<PendingUser>>;

describe('PendingUsersService', () => {
  let service: PendingUsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<PendingUser>>();
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Pending User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Pending user service create function', () => {
    it('should create a Pending user.', async () => {
      const PARAMS = {
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(PARAMS);

      const retPendingUser = await service.create(
        constants.RED_COMPANY_ID,
        createRedCompanyPendingUserDtoMock,
        getDirectory(redCompanyCvClientUserJWTMock),
        redCompanyCvClientUserJWTMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Pending user service update function', () => {
    it('should update a Pending user.', async () => {
      const PARAMS = {
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
        companyId: constants.RED_COMPANY_ID,
      };
      PENDING_USER_LIST[0].userAuthGroup = UserAuthGroup.COMPANY_ADMINISTRATOR;
      findPendingUsersEntityMock(PARAMS, PENDING_USER_LIST);

      const retPendingUser = await service.update(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
        updateRedCompanyPendingUserDtoMock,
        getDirectory(redCompanyCvClientUserJWTMock),
        redCompanyCvClientUserJWTMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Pending user service findPendingUsersDto function', () => {
    it('should find a Pending user by User Name and Company Id.', async () => {
      const PARAMS = {
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(PARAMS, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(
        constants.RED_COMPANY_PENDING_USER_NAME,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
    it('should find a Pending user by User Name.', async () => {
      const params: SelectQueryBuilderParameters = {
        userName: constants.RED_COMPANY_PENDING_USER_NAME,
      };
      findPendingUsersEntityMock(params, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
    it('should find all Pending users by Company Id.', async () => {
      const params: SelectQueryBuilderParameters = {
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(params, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(
        null,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
    it('should find all Pending user,', async () => {
      const params: SelectQueryBuilderParameters = {
        companyId: constants.RED_COMPANY_ID,
      };
      findPendingUsersEntityMock(params, PENDING_USER_LIST);

      const retPendingUser = await service.findPendingUsersDto(null, null);
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
  });

  describe('Pending user service remove function', () => {
    it('should find delete a Pending user.', async () => {
      const deleteResult = await service.remove(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
      expect(typeof deleteResult).toBe('object');
    });
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
