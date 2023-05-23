/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';

import {
  redCompanyAdminUserJWTMock,
  redCompanyCvClientUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';

import { UsersService } from '../../../src/modules/company-user-management/users/users.service';
import {
  createRedCompanyCvClientUserDtoMock,
  readRedCompanyCvClientUserDtoMock,
  updateRedCompanyCvClientUserDtoMock,
  updateRedCompanyCvClientUserStatusDtoMock,
} from '../../util/mocks/data/user.mock';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';
import { CompanyUsersController } from '../../../src/modules/company-user-management/users/company-users.controller';
import { getDirectory } from '../../../src/common/helper/auth.helper';

const COMPANY_ID_99 = 99;
let userService: DeepMocked<UsersService>;

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    userService = createMock<UsersService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyUsersController],
      providers: [{ provide: UsersService, useValue: userService }],
    }).compile();

    controller = module.get<CompanyUsersController>(CompanyUsersController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Company users controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Company users controller create function', () => {
    it('should return the created user', async () => {
      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;
      const currentUser = request.user as IUserJWT;

      userService.create.mockResolvedValue(readRedCompanyCvClientUserDtoMock);
      const retUser = await controller.create(
        request,
        constants.RED_COMPANY_ID,
        createRedCompanyCvClientUserDtoMock,
      );

      expect(typeof retUser).toBe('object');
      expect(retUser).toEqual(readRedCompanyCvClientUserDtoMock);
      expect(userService.create).toHaveBeenCalledWith(
        createRedCompanyCvClientUserDtoMock,
        constants.RED_COMPANY_ID,
        getDirectory(currentUser),
        currentUser,
      );
    });
  });

  describe('Users controller update function', () => {
    it('should return the updated user', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      userService.update.mockResolvedValue(readRedCompanyCvClientUserDtoMock);
      const retUser = await controller.update(
        request,
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
        updateRedCompanyCvClientUserDtoMock,
      );

      expect(typeof retUser).toBe('object');
      expect(retUser).toEqual(readRedCompanyCvClientUserDtoMock);

      expect(userService.update).toHaveBeenCalledWith(
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
        updateRedCompanyCvClientUserDtoMock,
      );
    });
    it('should throw DataNotFoundException when user not found', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      userService.update.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.update(
          request,
          COMPANY_ID_99,
          null,
          updateRedCompanyCvClientUserDtoMock,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Users controller updateStatus function', () => {
    it('should return the result of user Status Update', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      userService.updateStatus.mockResolvedValue({
        raw: undefined,
        affected: 1,
        generatedMaps: undefined,
      });
      const retUser = (await controller.updateStatus(
        request,
        constants.RED_COMPANY_ID,
        constants.RED_COMPANY_CVCLIENT_USER_GUID,
        updateRedCompanyCvClientUserStatusDtoMock,
      )) as { statusUpdated: boolean };

      expect(typeof retUser).toBe('object');
      expect(retUser.statusUpdated).toBeTruthy();
    });
    it('should throw DataNotFoundException when user not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      userService.updateStatus.mockResolvedValue({
        raw: undefined,
        affected: 0,
        generatedMaps: undefined,
      });

      await expect(async () => {
        (await controller.updateStatus(
          request,
          constants.RED_COMPANY_ID,
          constants.RED_COMPANY_CVCLIENT_USER_GUID,
          updateRedCompanyCvClientUserStatusDtoMock,
        )) as { statusUpdated: boolean };
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
