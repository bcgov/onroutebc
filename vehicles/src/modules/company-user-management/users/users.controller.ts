import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { ExceptionDto } from '@common/exception/exception.dto';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { UsersService } from './users.service';
import { Claim } from '@common/enum/claims.enum';
import { Request } from 'express';
import { IUserJWT } from '@common/interface/user-jwt.interface';
import { AuthOnly } from '@common/decorator/auth-only.decorator';
import { Permissions } from '@common/decorator/permissions.decorator';
import { DataNotFoundException } from '@common/exception/data-not-found.exception';
import { ReadUserDto } from './dto/response/read-user.dto';
import { IDP } from '@common/enum/idp.enum';
import { GetStaffUserQueryParamsDto } from './dto/request/queryParam/getStaffUser.query-params.dto';
import { GetUserClaimsQueryParamsDto } from './dto/request/queryParam/getUserClaims.query-params.dto';
import {
  CLIENT_USER_ROLE_LIST,
  IDIR_USER_ROLE_LIST,
  IDIRUserRole,
} from '@common/enum/user-role.enum';
import { doesUserHaveRole } from '@common/helper/auth.helper';
import { isFeatureEnabled } from '@common/helper/common.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ThrottlerGuard } from '@nestjs/throttler';
import { IsFeatureFlagEnabled } from '@common/decorator/is-feature-flag-enabled.decorator';
import { UpdateStaffUserDto } from './dto/request/update-staff-user.dto';
import { UserByUserGUIDPathParamsDto } from './dto/request/pathParam/userByUserGUID.path-params.dto';
import { UserStatus } from '@common/enum/user-status.enum';

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
  constructor(
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

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
  @UseGuards(ThrottlerGuard)
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
    if (await isFeatureEnabled(this.cacheManager, 'AUDIT_LOGIN')) {
      await this.userService.saveLoginInformation(currentUser, userExists);
    }
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /user/claims that retrieves a list of users' claims associated with
   * the given company ID.
   *
   * @param companyId The company Id for which claims are retrieved.
   *
   * @returns The list of claims associated with the given company ID.
   */
  @ApiOkResponse({
    description: "The list of User's Claims",
    isArray: true,
  })
  @ApiOperation({
    summary: "Retrieves a list of users' claims for a specified company ID.",
    description:
      'This endpoint queries all claims associated with the provided company ID for the calling user. ' +
      "It fetches claims by integrating with the User service, ensuring claims are accurately returned based on the company's context and the user's privileges.",
  })
  @Permissions({
    allowedBCeIDRoles: CLIENT_USER_ROLE_LIST,
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
  @Get('/claims')
  async getClaimsForUsers(
    @Req() request: Request,
    @Query() getUserRolesQueryParamsDto: GetUserClaimsQueryParamsDto,
  ): Promise<Claim[]> {
    const currentUser = request.user as IUserJWT;
    const claims = await this.userService.getClaimsForUser(
      currentUser.userGUID,
      getUserRolesQueryParamsDto.companyId,
    );
    return claims;
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
  @Permissions({
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
  @Get()
  async findAll(
    @Req() request: Request,
    @Query() getStaffUserQueryParamsDto?: GetStaffUserQueryParamsDto,
  ): Promise<ReadUserDto[]> {
    const currentUser = request.user as IUserJWT;
    if (!doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST)) {
      throw new ForbiddenException(
        `Forbidden for ${currentUser.orbcUserRole} role.`,
      );
    }

    if (getStaffUserQueryParamsDto.permitIssuerPPCUser) {
      return await this.userService.findPermitIssuerPPCUser();
    }

    const userStatusCode = [UserStatus.ACTIVE];
    if (getStaffUserQueryParamsDto.includeInactiveUsers) {
      userStatusCode.push(...[UserStatus.DISABLED, UserStatus.DELETED]);
    }

    return await this.userService.findUsersDto({
      pendingUser: false,
      userRole: getStaffUserQueryParamsDto.userRole,
      userDirectory: getStaffUserQueryParamsDto.userDirectory,
      statusCode: userStatusCode,
    });
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
  @Permissions({
    allowedBCeIDRoles: CLIENT_USER_ROLE_LIST,
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
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
      users = await this.userService.findUsersDto({
        userGUID,
        companyId: currentUser.associatedCompanies,
      });
    } else {
      users = await this.userService.findUsersDto({ userGUID });
    }
    if (!users?.length) {
      throw new DataNotFoundException();
    }
    return users?.at(0);
  }

  /**
   * Updates a staff user's role, status, or both, and returns the updated details.
   *
   * @param request The request containing the authenticated user.
   * @param userGUID The GUID of the staff user to update.
   * @param updateStaffUserDto Contains the staff user's new role, status, or both.
   * @returns The updated staff user's details.
   * @throws {DataNotFoundException} If the update returns no user.
   */
  @ApiOkResponse({
    description: 'The updated staff user resource.',
    type: ReadUserDto,
  })
  @ApiOperation({
    summary: 'Update a staff user role and/or status',
    description:
      'Updates the role, status, or both for a staff user. Provide at least one of userRole or userStatus in the request body. ' +
      'This endpoint is available to IDIR system administrators when the STAFF-USER-MANAGEMENT feature is enabled.',
  })
  @ApiParam({
    name: 'userGUID',
    description: 'The GUID of the staff user to update.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
    required: true,
  })
  @ApiBody({
    type: UpdateStaffUserDto,
    description: "Provide the staff user's new role, status, or both.",
  })
  @ApiBadRequestResponse({
    description:
      'The request body must include at least one of userRole or userStatus.',
    type: ExceptionDto,
  })
  @ApiForbiddenResponse({
    description: 'The caller is not an IDIR system administrator.',
    type: ExceptionDto,
  })
  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @IsFeatureFlagEnabled('STAFF-USER-MANAGEMENT')
  @Put(':userGUID')
  async update(
    @Req() request: Request,
    @Param() { userGUID }: UserByUserGUIDPathParamsDto,
    @Body() updateStaffUserDto: UpdateStaffUserDto,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    const user = await this.userService.staffUserUpdate(
      userGUID,
      updateStaffUserDto,
      currentUser,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }
}
