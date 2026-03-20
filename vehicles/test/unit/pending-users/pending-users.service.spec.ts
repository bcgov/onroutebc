import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';
import { DataSource, Repository } from 'typeorm';
import { PendingUser } from '../../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { PendingUsersProfile } from '../../../src/modules/company-user-management/pending-users/profiles/pending-user.profile';
import {
  PENDING_USER_LIST,
  createRedCompanyPendingUserDtoMock,
  readRedCompanyPendingUserDtoMock,
  updateRedCompanyPendingUserDtoMock,
} from '../../util/mocks/data/pending-user.mock';
import {
  MockQueryRunnerManager,
  createQueryBuilderMock,
} from '../../util/mocks/factory/dataSource.factory.mock';
import { ClientUserRole } from '../../../src/common/enum/user-role.enum';
import * as constants from '../../util/mocks/data/test-data.constants';
import { redCompanyCvClientUserJWTMock } from 'test/util/mocks/data/jwt.mock';
import { redCompanyEntityMock } from '../../util/mocks/data/company.mock';

interface SelectQueryBuilderParameters {
  userName?: string;
  companyId?: number;
}

let repo: DeepMocked<Repository<PendingUser>>;

describe('PendingUsersService', () => {
  let service: PendingUsersService;
  const mockQueryRunnerManager: MockQueryRunnerManager = {
    delete: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

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
      // Override the save method for this specific test
      mockQueryRunnerManager.save.mockResolvedValue(
        readRedCompanyPendingUserDtoMock,
      );

      mockQueryRunnerManager.findOne.mockResolvedValue(redCompanyEntityMock);

      const retPendingUser = await service.create(
        constants.RED_COMPANY_ID,
        createRedCompanyPendingUserDtoMock,
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
      PENDING_USER_LIST[0].userRole = ClientUserRole.COMPANY_ADMINISTRATOR;
      findPendingUsersEntityMock(PARAMS, PENDING_USER_LIST);

      const retPendingUser = await service.update(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
        updateRedCompanyPendingUserDtoMock,
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
