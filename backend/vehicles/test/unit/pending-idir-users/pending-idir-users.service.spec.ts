import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { Repository } from 'typeorm';
import * as constants from '../../util/mocks/data/test-data.constants';
import { PendingIdirUser } from 'src/modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import {
  createPendingIdirUserMock,
  pendingIdirUserEntityMock,
} from 'test/util/mocks/data/pending-idir-user.mock';
import { PendingIdirUsersProfile } from 'src/modules/company-user-management/pending-idir-users/profiles/pending-idir-user.profile';

let repo: DeepMocked<Repository<PendingIdirUser>>;

describe('PendingUsersService', () => {
  let service: PendingIdirUsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    repo = createMock<Repository<PendingIdirUser>>();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        PendingIdirUsersService,
        {
          provide: getRepositoryToken(PendingIdirUser),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        PendingIdirUsersProfile,
      ],
    }).compile();

    service = module.get<PendingIdirUsersService>(PendingIdirUsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Pending User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Pending idir user service create function', () => {
    it('should create a Pending idir user.', async () => {
      repo.save.mockResolvedValue(pendingIdirUserEntityMock);
      const retPendingUser = await service.create(createPendingIdirUserMock);
      expect(typeof retPendingUser).toBe('object');
    });
  });

  describe('Pending idir user service findPendingIdirUsersDto function', () => {
    it('should find a Pending idir user by User Name .', async () => {
      repo.findOne.mockResolvedValue(pendingIdirUserEntityMock);

      const retPendingUser = await service.findPendingIdirUser(
        constants.SYS_ADMIN_STAFF_USER_NAME,
      );
      expect(typeof retPendingUser).toBe('object');
    });
  });

  describe('Pending user service findPendingUsersDto function', () => {
    it('should find a all Pending  idir user.', async () => {
      repo.find.mockResolvedValue(Array(pendingIdirUserEntityMock));

      const retPendingUser = await service.findAll();
      expect(typeof retPendingUser).toBe('object');
    });
  });
});
