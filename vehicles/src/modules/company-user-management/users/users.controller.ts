import {
  BadRequestException,
  Controller,
  ForbiddenException,
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
  ApiTags,
  ApiOperation,
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
import { GetStaffUserQueryParamsDto } from './dto/request/queryParam/getStaffUser.query-params.dto';
import { GetUserRolesQueryParamsDto } from './dto/request/queryParam/getUserRoles.query-params.dto';
import { IDIR_USER_AUTH_GROUP_LIST } from '../../../common/enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';

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
  @ApiOperation({
    summary:
      'Verifies and retrieves user context based on GUID and associated company in ORBC',
    description:
      'This method verifies if a user exists in ORBC by their GUID and retrieves the user details along with the associated company, if any. ' +
      'It supports different identity providers, including IDIR and general ORBC user flows.',
  })
  @AuthOnly()
  @Post('user-context')
  async find(@Req() request: Request): Promise<ReadUserOrbcStatusDto> {
    const currentUser = request.user as IUserJWT;
    let userExists: ReadUserOrbcStatusDto;
    if (currentUser.identity_provider === IDP.IDIR) {
      userExists =
        await this.userService.validateAndCreateIdirUser(currentUser);
    } else {
      userExists = await this.userService.findORBCUser(currentUser);
    }
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /user/roles that retrieves a list of users' roles associated with
   * the given company ID.
   *
   * @param companyId The company Id for which roles are retrieved.
   *
   * @returns The list of roles associated with the given company ID.
   */
  @ApiOkResponse({
    description: "The list of User's Roles",
    isArray: true,
  })
  @ApiOperation({
    summary: "Retrieves a list of users' roles for a specified company ID.",
    description:
      'This endpoint queries all roles associated with the provided company ID for the calling user. ' +
      "It fetches roles by integrating with the User service, ensuring roles are accurately returned based on the company's context and the user's privileges.",
  })
  @Roles(Role.READ_SELF)
  @Get('/roles')
  async getRolesForUsers(
    @Req() request: Request,
    @Query() getUserRolesQueryParamsDto: GetUserRolesQueryParamsDto,
  ): Promise<Role[]> {
    const currentUser = request.user as IUserJWT;
    const roles = await this.userService.getRolesForUser(
      currentUser.userGUID,
      getUserRolesQueryParamsDto.companyId,
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
  @Roles(Role.READ_USER)
  @Get()
  async findAll(
    @Req() request: Request,
    @Query() getStaffUserQueryParamsDto?: GetStaffUserQueryParamsDto,
  ): Promise<ReadUserDto[]> {
    const currentUser = request.user as IUserJWT;
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      )
    ) {
      throw new ForbiddenException(
        `Forbidden for ${currentUser.orbcUserAuthGroup} role.`,
      );
    }

    if (getStaffUserQueryParamsDto.permitIssuerPPCUser) {
      return await this.userService.findPermitIssuerPPCUser();
    }

    return await this.userService.findUsersDto(
      null,
      null,
      false,
      getStaffUserQueryParamsDto.userAuthGroup,
    );
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users/:userGuid that retrieves a user by its GUID
   * (global unique identifier). It first checks the identity provider of the
   * current user. If the user identity provider is not IDIR, it validates that
   * the requested userGUID matches the currentUser's GUID and retrieves user
   * details based on associated companies. For IDIR users, it fetches both IDIR
   * and non-IDIR user details for the given userGUID, then combines and returns
   * the first result if any are found. Throws a BadRequestException if the GUIDs
   * do not match for non-IDIR users, and DataNotFoundException if no users are found.
   *
   * @param userGUID  The user GUID.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @ApiOperation({
    summary:
      'Retrieves comprehensive details for a single user identified by their GUID, ' +
      'accommodating both IDIR and non-IDIR user inquiries with appropriate access and identity validation.',
    description:
      'The endpoint first checks the identity provider of the ' +
      'current user. If the user identity provider is not IDIR, it validates that ' +
      "the requested userGUID matches the currentUser's GUID and retrieves user " +
      'details based on associated companies. For IDIR users, it fetches both IDIR ' +
      'and non-IDIR user details for the given userGUID, then combines and returns ' +
      'the first result if any are found. Throws a BadRequestException if the GUIDs ' +
      'do not match for non-IDIR users, and DataNotFoundException if no users are found.',
  })
  @Roles(Role.READ_SELF)
  @Get(':userGUID')
  async findUserDetails(
    @Req() request: Request,
    @Param('userGUID') userGUID: string,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    let users: ReadUserDto[] = [];
    if (currentUser.identity_provider !== IDP.IDIR) {
      if (userGUID !== currentUser.userGUID) {
        throw new BadRequestException(
          'The userGuid does not match userGuid in access token',
        );
      }
      users = await this.userService.findUsersDto(
        userGUID,
        currentUser.associatedCompanies,
      );
    } else {
      users = await this.userService.findUsersDto(userGUID);
    }
    if (!users?.length) {
      throw new DataNotFoundException();
    }
    return users?.at(0);
  }
}
