import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { UsersService } from './users.service';
import { Role } from '../../../common/enum/roles.enum';
import { Request } from 'express';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { Roles } from '../../../common/decorator/roles.decorator';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ReadUserDto } from './dto/response/read-user.dto';
import { IDP } from '../../../common/enum/idp.enum';

@ApiTags('Company and User Management - User')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
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
   * A POST method defined with a route of
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
  @Post('user-context')
  async find(@Req() request: Request): Promise<ReadUserOrbcStatusDto> {
    const currentUser = request.user as IUserJWT;
    let userExists: ReadUserOrbcStatusDto;
    if (currentUser.identity_provider == IDP.IDIR) {
      userExists = await this.userService.checkIdirUser(currentUser);
    } else {
      userExists = await this.userService.findORBCUser(
        currentUser.userGUID,
        currentUser.userName,
        currentUser.bceid_business_guid,
      );
    }
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /user/roles that retrieves a list of users associated with
   * the company ID
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
  @Roles(Role.READ_SELF)
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
   * @param companyId The company Id. Required when authorized as IDIR User.
   *
   * @returns The user list with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'permitIssuerPPCUser', required: false })
  @Roles(Role.READ_USER)
  @Get()
  async findAll(
    @Req() request: Request,
    @Query('companyId') companyId?: number,
    @Query('permitIssuerPPCUser') permitIssuerPPCUser?: boolean,
  ): Promise<ReadUserDto[]> {
    const currentUser = request.user as IUserJWT;
    if (
      currentUser.identity_provider === IDP.IDIR &&
      !companyId &&
      !permitIssuerPPCUser
    ) {
      throw new BadRequestException();
    } else if (
      currentUser.identity_provider === IDP.IDIR &&
      !companyId &&
      permitIssuerPPCUser
    ) {
      return await this.userService.findPermitIssuerPPCUser();
    }

    const companyIdList = companyId
      ? [companyId]
      : currentUser.associatedCompanies;
    return await this.userService.findUsersDto(undefined, companyIdList);
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users/:userGuid that retrieves a user by its GUID
   * (global unique identifier).
   *
   * @param userGUID  The user GUID.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Roles(Role.READ_SELF, Role.READ_USER)
  @Get(':userGUID')
  async findUserDetails(
    @Req() request: Request,
    @Param('userGUID') userGUID: string,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    let users: ReadUserDto[] = [];
    if (currentUser.identity_provider !== IDP.IDIR) {
      users = await this.userService.findUsersDto(
        userGUID,
        currentUser.associatedCompanies,
      );
    } else {
      users.push(await this.userService.findIdirUser(userGUID));
    }
    if (!users?.length) {
      throw new DataNotFoundException();
    }
    return users[0];
  }
}
