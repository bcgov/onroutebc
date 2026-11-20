import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Put,
  Param,
  Delete,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '@common/exception/exception.dto';
import { CreatePendingIdirUserDto } from './dto/request/create-pending-idir-user.dto';
import { PendingIdirUsersService } from './pending-idir-users.service';
import { ReadPendingIdirUserDto } from './dto/response/read-pending-idir-user.dto';
import { IUserJWT } from '@common/interface/user-jwt.interface';
import { Request } from 'express';
import { Permissions } from '@common/decorator/permissions.decorator';
import { IDIRUserRole } from '@common/enum/user-role.enum';
import { PendingIdirUserByUserNamePathParamsDto } from './dto/request/pathParam/pendingIdirUserByUserName.path-params.dto';
import { UpdatePendingIdirUserDto } from './dto/request/update-pending-idir-user.dto';
import { DeletePendingIdirUsersDto } from './dto/request/delete-pending-idir-users.dto';
import { DeleteDto } from '@modules/common/dto/response/delete.dto';
import { DataNotFoundException } from '@common/exception/data-not-found.exception';
import { IsFeatureFlagEnabled } from '@common/decorator/is-feature-flag-enabled.decorator';

@ApiTags('User Management - Pending IDIR User')
@ApiBadRequestResponse({
  description: 'The request is invalid.',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The requested pending IDIR user was not found.',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The requested HTTP method is not allowed.',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'An internal server error occurred.',
  type: ExceptionDto,
})
@ApiForbiddenResponse({
  description: 'The caller is not an IDIR system administrator.',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('pending-idir-users')
export class PendingIdirUsersController {
  constructor(
    private readonly pendingIdirUserService: PendingIdirUsersService,
  ) {}

  /**
   * A POST method defined with the @Post() decorator and a route of
   * pending-idir-users that creates a new pending idir user
   * @param createPendingIdirUserDto
   * @returns
   */
  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPendingIdirUserDto: CreatePendingIdirUserDto,
  ): Promise<ReadPendingIdirUserDto> {
    const currentUser = request.user as IUserJWT;
    const pendingIdirUser = await this.pendingIdirUserService.create(
      createPendingIdirUserDto,
      currentUser,
    );
    return pendingIdirUser;
  }

  /**
   * Updates the role of a pending IDIR user.
   *
   * @param userName The username of the pending IDIR user.
   * @param updatePendingIdirUserDto The updated role.
   * @returns The updated pending IDIR user.
   */
  @ApiOperation({
    summary: "Update a pending IDIR user's role",
    description:
      'Updates the role of the pending IDIR user identified by username. ' +
      'This endpoint is available to IDIR system administrators when the STAFF-USER-MANAGEMENT feature is enabled.',
  })
  @ApiParam({
    name: 'userName',
    description: 'The username of the pending IDIR user.',
    example: 'ASMITH',
    required: true,
  })
  @ApiBody({
    type: UpdatePendingIdirUserDto,
    description: 'The updated role for the pending IDIR user.',
  })
  @ApiOkResponse({
    description: 'The updated pending IDIR user.',
    type: ReadPendingIdirUserDto,
  })
  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @IsFeatureFlagEnabled('STAFF-USER-MANAGEMENT')
  @Put(':userName')
  async update(
    @Req() request: Request,
    @Param() { userName }: PendingIdirUserByUserNamePathParamsDto,
    @Body() updatePendingIdirUserDto: UpdatePendingIdirUserDto,
  ): Promise<ReadPendingIdirUserDto> {
    const currentUser = request.user as IUserJWT;
    const pendingIdirUser = await this.pendingIdirUserService.update(
      userName,
      updatePendingIdirUserDto,
      currentUser,
    );
    return pendingIdirUser;
  }

  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @Get()
  async findPendingIdirUsers(): Promise<ReadPendingIdirUserDto[]> {
    const pendingIdirUser = await this.pendingIdirUserService.findAll();
    return pendingIdirUser;
  }

  /**
   * Retrieves a pending IDIR user by username.
   *
   * @param userName The username of the pending IDIR user.
   * @returns The pending IDIR user details.
   */
  @ApiOperation({
    summary: 'Get a pending IDIR user by username',
    description:
      'Retrieves the pending IDIR user identified by username. ' +
      'This endpoint is available to IDIR system administrators when the STAFF-USER-MANAGEMENT feature is enabled.',
  })
  @ApiParam({
    name: 'userName',
    description: 'The username of the pending IDIR user.',
    example: 'ASMITH',
    required: true,
  })
  @ApiOkResponse({
    description: 'The pending IDIR user details.',
    type: ReadPendingIdirUserDto,
  })
  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @IsFeatureFlagEnabled('STAFF-USER-MANAGEMENT')
  @Get(':userName')
  async findPendingIdirUser(
    @Param() { userName }: PendingIdirUserByUserNamePathParamsDto,
  ): Promise<ReadPendingIdirUserDto> {
    const pendingIdirUser = await this.pendingIdirUserService.find(userName);
    return pendingIdirUser;
  }

  @Permissions({
    allowedIdirRoles: [IDIRUserRole.SYSTEM_ADMINISTRATOR],
  })
  @ApiOperation({
    summary: 'Delete pending IDIR users by username',
    description:
      'Deletes pending IDIR users whose usernames are provided. ' +
      'The response lists successfully deleted usernames and usernames that were not found. ' +
      'This endpoint is available to IDIR system administrators when the STAFF-USER-MANAGEMENT feature is enabled.',
  })
  @ApiBody({
    type: DeletePendingIdirUsersDto,
    description: 'The usernames of the pending IDIR users to delete.',
  })
  @ApiOkResponse({
    description: 'The usernames successfully deleted and not found.',
    type: DeleteDto,
  })
  @IsFeatureFlagEnabled('STAFF-USER-MANAGEMENT')
  @Delete()
  async remove(
    @Req() request: Request,
    @Body() deletePendingUsersDto: DeletePendingIdirUsersDto,
  ): Promise<DeleteDto> {
    const currentUser = request.user as IUserJWT;

    const deleteResult = await this.pendingIdirUserService.removeAll(
      deletePendingUsersDto.userNames,
      currentUser,
    );
    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }
}
