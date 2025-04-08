import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreatePendingUserDto } from './dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from './dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from './dto/response/read-pending-user.dto';
import { PendingUsersService } from './pending-users.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { Request } from 'express';
import { Permissions } from '../../../common/decorator/permissions.decorator';
import { DeleteDto } from '../../common/dto/response/delete.dto';
import { DeletePendingUsersDto } from './dto/request/delete-pending-users.dto';
import {
  ClientUserRole,
  IDIR_USER_ROLE_LIST,
  IDIRUserRole,
} from '../../../common/enum/user-role.enum';
import { doesUserHaveRole } from '../../../common/helper/auth.helper';
import { TPS_MIGRATED_USER } from '../../../common/constants/api.constant';

@ApiTags('Company and User Management - Pending User')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Pending User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Pending User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Pending User Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The Pending User Api Unprocessable Entity Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('companies/:companyId/pending-users')
export class PendingUsersController {
  constructor(private readonly pendingUserService: PendingUsersService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of
   * company/:companyId/pending-user that creates a new pending user
   * associated with the company.
   *
   * @param companyId The company Id.
   * @param createPendingUserDto The http request object containing the pending user
   * details.
   *
   * @returns The details of the pending user with response object
   * {@link ReadCompanyUserDto}
   */
  @ApiCreatedResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createUserDto: CreatePendingUserDto,
  ) {
    const currentUser = request.user as IUserJWT;
    return await this.pendingUserService.create(
      companyId,
      createUserDto,
      currentUser,
    );
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * company/:companyId/pending-user that retrieves a list of pending users
   * associated with the company
   *
   * @param companyId The company Id.
   *
   * @returns The list of pending users with response object as an array of
   * {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource List',
    type: ReadPendingUserDto,
    isArray: true,
  })
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Get()
  async findAll(
    @Param('companyId') companyId: number,
  ): Promise<ReadPendingUserDto[]> {
    return await this.pendingUserService.findPendingUsersDto(null, companyId);
  }

  /**
   * A GET method defined with the @Get(:userName) decorator and a route of
   * company/:companyId/pending-user/:userName that retrieves the pending user
   * associated with the company by user name
   *
   * @param companyId The company Id.
   * @param userName The userName of the pending user.
   *
   * @returns The pending user with response object {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Get(':userName')
  async find(
    @Param('companyId') companyId: number,
    @Param('userName') userName: string,
  ): Promise<ReadPendingUserDto> {
    const pendingUser = await this.pendingUserService.findPendingUsersDto(
      userName,
      companyId,
    );

    if (!pendingUser?.length) {
      throw new DataNotFoundException();
    }
    return pendingUser[0];
  }

  /**
   * A PUT method defined with the @Put(':userName') decorator and a route of
   * company/:companyId/pending-user/:userName that updates a pending user by
   * user name.
   *
   * @param companyId The company Id.
   * @param userName The user name of the pending user.
   * @param updatePendingUserDto The http request object of type
   * {@link UpdatePendingUserDto} containing the pending user details.
   *
   * @returns The pending user with response object {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Put(':userName')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('userName') userName: string,
    @Body() updatePendingUserDto: UpdatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const currentUser = request.user as IUserJWT;
    /* Before removing the below condition - Create User method needs to be revisited.
      UserName vs UserGUID mismatch scenarios need to be handled*/
    if (userName?.toUpperCase() === TPS_MIGRATED_USER.toUpperCase()) {
      throw new BadRequestException(
        `Update not allowed for username ${userName}`,
      );
    }
    const pendingUser = await this.pendingUserService.update(
      companyId,
      userName,
      updatePendingUserDto,
      currentUser,
    );
    if (!pendingUser) {
      throw new DataNotFoundException();
    }
    return pendingUser;
  }

  /**
   * Deletes pending users by their username, requiring authorization.
   * Only users with the COMPANY_ADMINISTRATOR role or belonging to certain groups are allowed to perform this action.
   * Without the required permissions, a ForbiddenException is raised.
   *
   * @param companyId The identifier for the company.
   * @param deletePendingUsersDto Data transfer object containing the usernames of the pending users to be deleted.
   * @returns A response encapsulated in {@link DeleteDto}, detailing the list of users successfully removed.
   * If no users are removed, a DataNotFoundException is thrown.
   */
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @ApiOperation({
    summary: 'Deletes pending users by username with authorization',
    description:
      'Allows authorized deletion of pending users by their username for a specific company. ' +
      'Authorization requires COMPANY_ADMINISTRATOR role or membership in specific groups. ' +
      'Returns the list of successfully deleted users or raises exceptions for unauthorized access or no users deleted.',
  })
  @ApiOkResponse({
    description:
      'The Delete Resource containing successful and failed identifiers.',
    type: DeleteDto,
  })
  @Delete()
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() deletePendingUsersDto: DeletePendingUsersDto,
  ): Promise<DeleteDto> {
    const currentUser = request.user as IUserJWT;
    if (
      currentUser.orbcUserRole !== ClientUserRole.COMPANY_ADMINISTRATOR &&
      !doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST)
    ) {
      throw new ForbiddenException();
    }
    const deleteResult = await this.pendingUserService.removeAll(
      deletePendingUsersDto.userNames,
      companyId,
    );
    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }
}
