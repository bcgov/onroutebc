import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { ExceptionDto } from '@common/exception/exception.dto';

import { Permissions } from '@common/decorator/permissions.decorator';
import { DataNotFoundException } from '@common/exception/data-not-found.exception';

import { IDIRUserRole } from '@common/enum/user-role.enum';

import { GetUserHistoryQueryParamsDto } from './dto/request/queryParam/getUserHistory.query-params.dto';
import { UserManagmentActivityService } from './user-management-activity.service';
import { ReadUserManagementActivityDto } from './dto/response/read-user-management-activity.dto';
import { IsFeatureFlagEnabled } from '@common/decorator/is-feature-flag-enabled.decorator';

@ApiTags('Company and User Management - User')
@ApiBadRequestResponse({
  description: 'The request parameters are invalid.',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'No matching user management activity was found.',
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
@ApiBearerAuth()
@Controller('users/history')
export class UserManagementActivityController {
  constructor(
    private readonly userManagmentActivityService: UserManagmentActivityService,
  ) {}

  @ApiOperation({
    summary: 'Get user management activity history',
    description:
      'Retrieves user management activity history for a registered or pending user. ' +
      'Provide at least one query parameter. If both are provided, userGUID takes precedence over userName. ' +
      'This endpoint is available to IDIR system administrators when the STAFF-USER-MANAGEMENT feature is enabled.',
  })
  @ApiQuery({
    name: 'userGUID',
    required: false,
    description:
      'The GUID of a registered user. Takes precedence over userName when both are provided.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
  })
  @ApiQuery({
    name: 'userName',
    required: false,
    description:
      'The username of a pending or invited user. Used when userGUID is not provided.',
    example: 'ASMITH',
  })
  @ApiOkResponse({
    description: 'The user management activity history.',
    isArray: true,
    type: ReadUserManagementActivityDto,
  })
  @ApiBadRequestResponse({
    description: 'At least one of userGUID or userName must be provided.',
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
  @Get()
  async findUserHistory(
    @Query() { userName, userGUID }: GetUserHistoryQueryParamsDto,
  ): Promise<ReadUserManagementActivityDto[]> {
    if (!userName && !userGUID) {
      throw new BadRequestException(
        'At least one of the query parameters is required.',
      );
    }

    const userHistory =
      await this.userManagmentActivityService.fetchUserManagementActivity({
        userGUID,
        userName,
      });
    if (!userHistory?.length) {
      throw new DataNotFoundException();
    }

    return userHistory;
  }
}
