import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { UsersService } from './users.service';
import { Role } from '../../../common/enum/roles.enum';
import { Request } from 'express';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { validateUserCompanyAndRoleForUserGuidQueryParam } from '../../../common/helper/auth.helper';
import { Roles } from '../../../common/decorator/roles.decorator';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadUserDto } from './dto/response/read-user.dto';
import { IDP } from '../../../common/enum/idp.enum';

@ApiTags('Company and User Management - User')
@ApiNotFoundResponse({
  description: 'The User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The User Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * A GET method defined with a route of
   * /user-context that verifies if the user exists in ORBC and retrieves
   * the user by its GUID (global unique identifier) and associated company, if any.
   *
   * @returns The user details with response object {@link ReadUserOrbcStatusDto}.
   */
  @ApiOkResponse({
    description: 'The User Orbc Status Exists Resource',
    type: ReadUserOrbcStatusDto,
  })
  @AuthOnly()
  @Get('user-context')
  async find(@Req() request: Request): Promise<ReadUserOrbcStatusDto> {
    const currentUser = request.user as IUserJWT;
    const userExists = await this.userService.findORBCUser(
      currentUser.userGUID,
      currentUser.userName,
      currentUser.bceid_business_guid,
    );
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /user/list that retrieves a list of users associated with
   * the company ID
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyId The company Id.
   *
   * @returns The user list with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: "The list of User's Roles",
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @Roles(Role.READ_SELF, Role.READ_USER)
  @Get('/roles')
  async getRolesForUsers(
    @Req() request: Request,
    @Query('companyId') companyId?: number,
  ): Promise<Role[]> {
    const currentUser = request.user as IUserJWT;
    const roles = await this.userService.getRolesForUser(
      currentUser.userGUID,
      companyId,
    );
    return roles;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users that retrieves a list of users associated with
   * the company ID
   *
   * @param companyId The company Id.  Mandatory for all user directories apart from IDIR.
   *
   * @returns The user list with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @Roles(Role.READ_USER)
  @Get()
  async findAll(
    @Req() request: Request,
    @Query('companyId') companyId?: number,
  ): Promise<ReadUserDto[]> {
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider !== IDP.IDIR && !companyId) {
      throw new BadRequestException();
    }
    return await this.userService.findAllUsers(companyId);
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users/:userGuid that retrieves a user by its GUID
   * (global unique identifier).
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyId  The company Id. Mandatory for all user directories apart from IDIR.
   * @param userGUID  The user GUID.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @Roles(Role.READ_SELF, Role.READ_USER)
  @Get(':userGUID')
  async findUserDetails(
    @Req() request: Request,
    @Param('userGUID') userGUID: string,
    @Query('companyId') companyId?: number,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider !== IDP.IDIR && !companyId) {
      throw new BadRequestException();
    }
    userGUID = await this.validateUserCompanyAndRoleForUserGuidQueryParam(
      currentUser,
      userGUID,
      [Role.READ_USER],
    );

    const companyUser = await this.userService.findUserbyUserGUID(userGUID);
    if (!companyUser) {
      throw new DataNotFoundException();
    }
    return companyUser;
  }

  private async validateUserCompanyAndRoleForUserGuidQueryParam(
    currentUser: IUserJWT,
    userGUID: string,
    roles: Role[],
  ) {
    if (userGUID === currentUser.userGUID) {
      return userGUID;
    }
    const userCompanies = userGUID
      ? await this.userService.getCompaniesForUser(userGUID)
      : undefined;

    validateUserCompanyAndRoleForUserGuidQueryParam(
      roles,
      userGUID,
      userCompanies,
      currentUser,
    );
    userGUID = userGUID ? userGUID : currentUser.userGUID;
    return userGUID;
  }
}
