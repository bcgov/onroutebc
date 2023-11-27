/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Request } from 'express';

import {
  redCompanyAdminUserJWTMock,
  sysAdminStaffUserJWTMock,
} from '../../util/mocks/data/jwt.mock';
import * as constants from '../../util/mocks/data/test-data.constants';
import { UsersController } from '../../../src/modules/company-user-management/users/users.controller';
import { UsersService } from '../../../src/modules/company-user-management/users/users.service';
import {
  USER_DTO_LIST,
  readRedAdminUserOrbcStatusDtoMock,
  readRedCompanyAdminUserDtoMock,
} from '../../util/mocks/data/user.mock';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';

import { BadRequestException } from '@nestjs/common';

const COMPANY_ID_99 = 99;
let userService: DeepMocked<UsersService>;

interface FindUsersDtoMockParameters {
  userGUID?: string;
  companyId?: number[];
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    userService = createMock<UsersService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: userService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Users controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Users controller find function', () => {
    it('should return the user context', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      const currentUser = request.user as IUserJWT;

      userService.findORBCUser.mockResolvedValue(
        readRedAdminUserOrbcStatusDtoMock,
      );
      const retOrbcUserContext = await controller.find(request);
      expect(typeof retOrbcUserContext).toBe('object');
      expect(retOrbcUserContext).toEqual(readRedAdminUserOrbcStatusDtoMock);
      expect(userService.findORBCUser).toHaveBeenCalledWith(
        currentUser.userGUID,
        currentUser.userName,
        currentUser.bceid_business_guid,
      );
    });
  });

  describe('Users controller getRolesForUsers function', () => {
    it('should return the user Roles', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      const currentUser = request.user as IUserJWT;

      userService.getRolesForUser.mockResolvedValue(currentUser.roles);
      const retUserRoles = await controller.getRolesForUsers(
        request,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retUserRoles).toBe('object');

      expect(userService.getRolesForUser).toHaveBeenCalledWith(
        currentUser.userGUID,
        constants.RED_COMPANY_ID,
      );
    });
  });

  describe('Users controller findAll function', () => {
    it('should return the users', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;

      const params: FindUsersDtoMockParameters = {
        companyId: [constants.RED_COMPANY_ID],
      };
      findUsersDtoMock(params);
      const retUsers = await controller.findAll(
        request,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retUsers).toBe('object');

      expect(userService.findUsersDto).toHaveBeenCalledWith(undefined, [
        constants.RED_COMPANY_ID,
      ]);
    });
    it('should return the users when Company Id is not provided', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      const params: FindUsersDtoMockParameters = {
        companyId: [constants.RED_COMPANY_ID],
      };
      findUsersDtoMock(params);
      const retUsers = await controller.findAll(request);
      expect(typeof retUsers).toBe('object');

      expect(userService.findUsersDto).toHaveBeenCalledWith(undefined, [
        constants.RED_COMPANY_ID,
      ]);
      expect(retUsers).toContainEqual(readRedCompanyAdminUserDtoMock);
      expect(retUsers).toHaveLength(2);
    });
    it('should throw Bad Request Exception when the company Id is not provided for Staff User', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      await expect(async () => {
        await controller.findAll(request);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('Users controller findUserDetails function', () => {
    it('should return the user details', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      const params: FindUsersDtoMockParameters = {
        userGUID: constants.RED_COMPANY_ADMIN_USER_GUID,
        companyId: [constants.RED_COMPANY_ID],
      };
      findUsersDtoMock(params);
      const retUsers = await controller.findUserDetails(
        request,
        constants.RED_COMPANY_ADMIN_USER_GUID,
      );
      expect(typeof retUsers).toBe('object');

      expect(userService.findUsersDto).toHaveBeenCalledWith(
        constants.RED_COMPANY_ADMIN_USER_GUID,
        [constants.RED_COMPANY_ID],
      );
    });

    it('should throw DataNotFound Exception when user is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      const params: FindUsersDtoMockParameters = {
        userGUID: 'D9AE454841CA4F63812CD91FD8F204D9',
        companyId: [COMPANY_ID_99],
      };
      findUsersDtoMock(params);

      await expect(async () => {
        await controller.findUserDetails(
          request,
          'D9AE454841CA4F63812CD91FD8F204D9',
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});

function findUsersDtoMock(
  params: FindUsersDtoMockParameters,
  userList = USER_DTO_LIST,
) {
  const filteredList = userList
    .filter((r) => {
      const isMatchedUserGUID = params.userGUID
        ? r.userDto.userGUID === params.userGUID
        : true;
      const isMatchedCompanyId = params.companyId?.length
        ? params.companyId.includes(r.companyId)
        : true;
      return isMatchedUserGUID && isMatchedCompanyId;
    })
    ?.map((r) => r.userDto);

  jest.spyOn(userService, 'findUsersDto').mockResolvedValue(filteredList);
}
