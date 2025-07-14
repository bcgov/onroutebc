/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
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
  readSysAdminStaffUserDtoMock,
} from '../../util/mocks/data/user.mock';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';
import { GetStaffUserQueryParamsDto } from '../../../src/modules/company-user-management/users/dto/request/queryParam/getStaffUser.query-params.dto';
import { IDIRUserRole } from '../../../src/common/enum/user-role.enum';
import { BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const COMPANY_ID_99 = 99;
let userService: DeepMocked<UsersService>;

interface FindUsersDtoMockParameters {
  userGUID?: string;
  companyId?: number[];
}

let cacheManager: DeepMocked<Cache>;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();
    userService = createMock<UsersService>();
    cacheManager = createMock<Cache>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: userService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
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
      expect(userService.findORBCUser).toHaveBeenCalledWith(currentUser);
    });
  });

  describe('Users controller getRolesForUsers function', () => {
    it('should return the user Roles', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      const currentUser = request.user as IUserJWT;

      userService.getClaimsForUser.mockResolvedValue(currentUser.claims);
      const retUserRoles = await controller.getClaimsForUsers(request, {
        companyId: constants.RED_COMPANY_ID,
      });
      expect(typeof retUserRoles).toBe('object');

      expect(userService.getClaimsForUser).toHaveBeenCalledWith(
        currentUser.userGUID,
        constants.RED_COMPANY_ID,
      );
    });
  });

  describe('Users controller findAll function', () => {
    it('should return the users', async () => {
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;

      userService.findPermitIssuerPPCUser.mockResolvedValue(null);
      userService.findUsersDto.mockResolvedValue([
        readSysAdminStaffUserDtoMock,
      ]);

      const getStaffUserQueryParamsDto: GetStaffUserQueryParamsDto = {
        permitIssuerPPCUser: false,
        userRole: IDIRUserRole.SYSTEM_ADMINISTRATOR,
      };
      const retUsers = await controller.findAll(
        request,
        getStaffUserQueryParamsDto,
      );
      expect(typeof retUsers).toBe('object');
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

    it('should throw BadRequestException when user guid mismatch', async () => {
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
      }).rejects.toThrow(BadRequestException);
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
