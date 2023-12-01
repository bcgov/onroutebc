/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { sysAdminStaffUserJWTMock } from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';
import { PendingIdirUsersService } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.service';
import { PendingIdirUsersController } from 'src/modules/company-user-management/pending-idir-users/pending-idir-users.controller';
import {
  createPendingIdirUserMock,
  pendingIdirUserEntityMock,
  readPendingIdirUserMock,
} from 'test/util/mocks/data/pending-idir-user.mock';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

let pendingIdirUserService: DeepMocked<PendingIdirUsersService>;

describe('PendingIdirUsersController', () => {
  let controller: PendingIdirUsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    pendingIdirUserService = createMock<PendingIdirUsersService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingIdirUsersController],
      providers: [
        { provide: PendingIdirUsersService, useValue: pendingIdirUserService },
      ],
    }).compile();

    controller = module.get<PendingIdirUsersController>(
      PendingIdirUsersController,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Pending users controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Pending users controller create function', () => {
    it('should create a company', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      const currentUser = request.user as IUserJWT;
      pendingIdirUserService.create.mockResolvedValue(readPendingIdirUserMock);
      const retPendingUser = await controller.create(
        request,
        createPendingIdirUserMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.userName).toEqual(
        constants.SYS_ADMIN_STAFF_USER_NAME,
      );
      expect(pendingIdirUserService.create).toHaveBeenCalledWith(
        createPendingIdirUserMock,
        currentUser,
      );
    });
  });

  describe('Pending users controller findAll function', () => {
    it('should find all pending idir users', async () => {
      pendingIdirUserService.findAll.mockResolvedValue(
        Array(pendingIdirUserEntityMock),
      );
      const retPendingUser = await controller.findPendingIdirUser();
      expect(typeof retPendingUser).toBe('object');
    });
  });
});
