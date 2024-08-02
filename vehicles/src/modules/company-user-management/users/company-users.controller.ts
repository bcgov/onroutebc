import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { Delete, Get, Query, Req } from '@nestjs/common/decorators';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ReadUserDto } from './dto/response/read-user.dto';
import { UsersService } from './users.service';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetCompanyUserQueryParamsDto } from './dto/request/queryParam/getCompanyUser.query-params.dto';
import { GetCompanyUserByUserGUIDPathParamsDto } from './dto/request/pathParam/getCompanyUserByUserGUID.path-params.dto';
import { DeleteUsersDto } from './dto/request/delete-users.dto';
import { DeleteDto } from '../../common/dto/response/delete.dto';
import {
  ClientUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
  IDIRUserAuthGroup,
} from '../../../common/enum/user-auth-group.enum';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';

@ApiTags('Company and User Management - Company User')
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
@Controller('companies/:companyId/users')
export class CompanyUsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Retrieves a list of users associated with a specified company ID. This method
   * supports filtering users based on their status (e.g., including pending users).
   *
   * @param companyId The unique identifier of the company.
   * @param getCompanyUserQueryParamsDto Query parameters for filtering the users.
   *
   * @returns A list of users related to the specified company as defined by {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @ApiParam({ name: 'companyId', required: true })
  @Roles({
    allowedBCeIDRoles: [ClientUserAuthGroup.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserAuthGroup.PPC_CLERK,
      IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
      IDIRUserAuthGroup.CTPO,
    ],
  })
  @Get()
  async findAllCompanyUsers(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Query() getCompanyUserQueryParamsDto: GetCompanyUserQueryParamsDto,
  ) {
    return await this.userService.findUsersDto(
      undefined,
      [companyId],
      getCompanyUserQueryParamsDto.includePendingUser,
    );
  }

  /**
   * A POST method defined with the @Post() decorator and a route of
   * company/:companyId/user that creates a new user associated to a company.
   *
   * @param createUserDto The http request object containing the user details.
   *
   * @returns The details of the new user with response object
   * {@link ReadUserDto}
   */
  @ApiCreatedResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @AuthOnly()
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    const currentUser = request.user as IUserJWT;

    return await this.userService.create(createUserDto, companyId, currentUser);
  }

  /**
   * A GET method defined with the @Get(':userGUID') decorator and a route of
   * /companies/:companyId/users/:userGUID that retrieves a user details by its GUID.
   *
   * @param companyId The company Id.
   * @param userGUID The GUID of the user.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Roles({
    allowedBCeIDRoles: [ClientUserAuthGroup.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserAuthGroup.PPC_CLERK,
      IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
      IDIRUserAuthGroup.CTPO,
    ],
  })
  @Get(':userGUID')
  async get(
    @Param() params: GetCompanyUserByUserGUIDPathParamsDto,
  ): Promise<ReadUserDto> {
    const { companyId, userGUID } = params;
    const users = await this.userService.findUsersDto(userGUID, [companyId]);
    if (!users?.length) {
      throw new DataNotFoundException();
    }
    return users[0];
  }

  /**
   * A PUT method defined with the @Put(':userGUID') decorator and a route of
   * /companies/:companyId/users/:userGUID that updates a user details by its GUID.
   *
   * @param companyId The company Id.
   * @param userGUID The GUID of the user.
   *
   * @returns The updated user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Roles({
    allowedBCeIDRoles: [ClientUserAuthGroup.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserAuthGroup.PPC_CLERK,
      IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
      IDIRUserAuthGroup.CTPO,
    ],
  })
  @Put(':userGUID')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    const user = await this.userService.update(
      userGUID,
      updateUserDto,
      companyId,
      currentUser,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }

  /**
   * Deletes one or more users associated with a specified company ID based on their GUIDs. This method requires
   * the current user to have either COMPANY_ADMINISTRATOR role or be part of the idirUserAuthGroupList to proceed.
   * Throws ForbiddenException if the current user lacks the required role or group.
   *
   * @param companyId The unique identifier of the company.
   * @param deleteUsersDto DTO containing the GUIDs of users to delete.
   * @returns A {@link DeleteDto} object including counts of successfully deleted users. Throws DataNotFoundException
   * if no delete result is obtained.
   */
  @ApiOperation({
    summary: 'Delete users associated with a company',
    description:
      'Allows deletion of one or more users associated with a given company ID, based on user GUIDs. ' +
      'Requires specific user roles or group memberships to execute.' +
      'Returns a list of deleted users or throws exceptions for unauthorized access or operational failures.',
  })
  @ApiOkResponse({
    description:
      'The Delete Resource containing successful and failed identifiers.',
    type: DeleteDto,
  })
  @Delete()
  @Roles({
    allowedBCeIDRoles: [ClientUserAuthGroup.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserAuthGroup.PPC_CLERK,
      IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
      IDIRUserAuthGroup.CTPO,
    ],
  })
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() deleteUsersDto: DeleteUsersDto,
  ): Promise<DeleteDto> {
    const currentUser = request.user as IUserJWT;
    if (
      currentUser.orbcUserAuthGroup !==
        ClientUserAuthGroup.COMPANY_ADMINISTRATOR &&
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      )
    ) {
      throw new ForbiddenException();
    }
    const deleteResult = await this.userService.removeAll(
      deleteUsersDto.userGUIDs,
      companyId,
      currentUser,
    );
    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }
}
