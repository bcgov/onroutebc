/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';

import { redCompanyAdminUserJWTMock } from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';
import { PendingUsersController } from '../../../src/modules/company-user-management/pending-users/pending-users.controller';
import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';
import {
  createRedCompanyPendingUserDtoMock,
  readRedCompanyPendingUserDtoMock,
  updateRedCompanyPendingUserDtoMock,
} from '../../util/mocks/data/pending-user.mock';
import { UserAuthGroup } from '../../../src/common/enum/user-auth-group.enum';
import { getDirectory } from 'src/common/helper/auth.helper';

const COMPANY_ID_99 = 99;
let pendingUserService: DeepMocked<PendingUsersService>;

describe('PendingUsersController', () => {
  let controller: PendingUsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    pendingUserService = createMock<PendingUsersService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendingUsersController],
      providers: [
        { provide: PendingUsersService, useValue: pendingUserService },
      ],
    }).compile();

    controller = module.get<PendingUsersController>(PendingUsersController);
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
      request.user = redCompanyAdminUserJWTMock;
      pendingUserService.create.mockResolvedValue(
        readRedCompanyPendingUserDtoMock,
      );
      const retPendingUser = await controller.create(
        request,
        constants.RED_COMPANY_ID,
        createRedCompanyPendingUserDtoMock,
      );
      expect(typeof retPendingUser).toBe('object');
      expect(retPendingUser.companyId).toEqual(constants.RED_COMPANY_ID);
      expect(retPendingUser.userName).toEqual(
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
      expect(pendingUserService.create).toHaveBeenCalledWith(
        constants.RED_COMPANY_ID,
        createRedCompanyPendingUserDtoMock,
        getDirectory(redCompanyAdminUserJWTMock),
        redCompanyAdminUserJWTMock,
      );
    });
  });

  describe('Pending users controller findAll function', () => {
    it('should return all pending users', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      pendingUserService.findPendingUsersDto.mockResolvedValue([
        readRedCompanyPendingUserDtoMock,
      ]);
      const retPendingUsers = await controller.findAll(
        constants.RED_COMPANY_ID,
      );
      expect(typeof retPendingUsers).toBe('object');
      expect(retPendingUsers).toContainEqual(readRedCompanyPendingUserDtoMock);
    });
  });

  describe('Pending users controller find function', () => {
    it('should return the pending user', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      pendingUserService.findPendingUsersDto.mockResolvedValue([
        readRedCompanyPendingUserDtoMock,
      ]);
      const retPendingUsers = await controller.find(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
      expect(typeof retPendingUsers).toBe('object');
      expect(retPendingUsers).toEqual(readRedCompanyPendingUserDtoMock);
    });
    it('should throw a Data Not Found Exception when the pending user is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      pendingUserService.findPendingUsersDto.mockResolvedValue([]);
      await expect(async () => {
        await controller.find(
          COMPANY_ID_99,
          constants.RED_COMPANY_PENDING_USER_NAME,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Pending users controller update function', () => {
    it('should return the updated pending user', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      pendingUserService.update.mockResolvedValue({
        ...readRedCompanyPendingUserDtoMock,
        userAuthGroup: UserAuthGroup.COMPANY_ADMINISTRATOR,
      });
      const retPendingUsers = await controller.update(
        request,
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
        updateRedCompanyPendingUserDtoMock,
      );
      expect(typeof retPendingUsers).toBe('object');
      expect(retPendingUsers).toEqual({
        ...readRedCompanyPendingUserDtoMock,
        userAuthGroup: UserAuthGroup.COMPANY_ADMINISTRATOR,
      });
    });
    it('should throw a Data Not Found Exception when the pending user is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      pendingUserService.update.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.update(
          request,
          COMPANY_ID_99,
          constants.RED_COMPANY_PENDING_USER_NAME,
          updateRedCompanyPendingUserDtoMock,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Pending users controller remove function.', () => {
    it('should delete the pending users', async () => {
      pendingUserService.remove.mockResolvedValue({
        raw: undefined,
        affected: 1,
      });
      const deleteResult = await controller.remove(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(pendingUserService.remove).toHaveBeenCalledWith(
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_PENDING_USER_NAME,
      );
    });

    it('should thrown a DataNotFoundException if the Pending user does not exist', async () => {
      pendingUserService.remove.mockResolvedValue({
        raw: undefined,
        affected: 0,
      });
      await expect(async () => {
        await controller.remove(
          COMPANY_ID_99,
          constants.RED_COMPANY_PENDING_USER_NAME,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
