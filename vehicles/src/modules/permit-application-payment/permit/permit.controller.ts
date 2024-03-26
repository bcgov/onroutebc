import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Query,
  Res,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PermitService } from './permit.service';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Request, Response } from 'express';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { FileDownloadModes } from '../../../common/enum/file-download-modes.enum';
import { ReadFileDto } from '../../common/dto/response/read-file.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { PermitHistoryDto } from './dto/response/permit-history.dto';
import { ResultDto } from './dto/response/result.dto';
import { VoidPermitDto } from './dto/request/void-permit.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginate-response';
import { GetPermitQueryParamsDto } from './dto/request/queryParam/getPermit.query-params.dto';
import {
  ClientUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
} from 'src/common/enum/user-auth-group.enum';
import { ReadPermitMetadataDto } from './dto/response/read-permit-metadata.dto';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';
import { CreateNotificationDto } from '../../common/dto/request/create-notification.dto';
import { ReadNotificationDto } from '../../common/dto/response/read-notification.dto';

@ApiBearerAuth()
@ApiTags('Permit')
@ApiNotFoundResponse({
  description: 'The Permit Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Permit Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Permit Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('permits')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @ApiOkResponse({
    description: 'The Permit Resource to get revision and payment history.',
    type: PermitHistoryDto,
    isArray: true,
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId/history')
  async getPermitHisory(
    @Param('permitId') permitId: string,
  ): Promise<PermitHistoryDto[]> {
    return this.permitService.findPermitHistory(permitId);
  }

  /**
   * Get Permits of Logged in user
   * @Query companyId Company id of logged in user
   * @param status if true get active permits else get others
   *
   */
  @ApiPaginatedResponse(ReadPermitMetadataDto)
  @Roles(Role.READ_PERMIT)
  @Get()
  async getPermit(
    @Req() request: Request,
    @Query() getPermitQueryParamsDto: GetPermitQueryParamsDto,
  ): Promise<PaginationDto<ReadPermitMetadataDto>> {
    const currentUser = request.user as IUserJWT;
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      !getPermitQueryParamsDto.companyId
    ) {
      throw new BadRequestException(
        `Company Id is required for roles except ${IDIR_USER_AUTH_GROUP_LIST.join(', ')}.`,
      );
    }

    const userGuid =
      ClientUserAuthGroup.PERMIT_APPLICANT === currentUser.orbcUserAuthGroup
        ? currentUser.userGUID
        : null;

    return await this.permitService.findPermit({
      page: getPermitQueryParamsDto.page,
      take: getPermitQueryParamsDto.take,
      orderBy: getPermitQueryParamsDto.orderBy,
      companyId: getPermitQueryParamsDto.companyId,
      expired: getPermitQueryParamsDto.expired,
      searchColumn: getPermitQueryParamsDto.searchColumn,
      searchString: getPermitQueryParamsDto.searchString,
      userGUID: userGuid,
      currentUser: currentUser,
    });
  }

  /**
   * Fetches all available permit types from the service layer and returns them.
   * Uses an @AuthOnly() decorator to enforce authentication.
   * The route for accessing this method is defined under '/permits/permit-types'.
   * @returns A promise that resolves to a record object where each key-value pair represents a permit type id and its name.
   */
  @AuthOnly()
  @ApiOperation({
    summary: 'Fetch all permit types',
    description:
      'Fetches all available permit types from the service layer and returns them, enforcing authentication.',
  })
  @Get('permit-types')
  async getPermitTypes(): Promise<Record<string, string>> {
    const permitTypes = await this.permitService.getPermitType();
    return permitTypes;
  }

  @ApiOkResponse({
    description: 'Retrieves a specific Permit Resource by its ID.',
    type: ReadPermitDto,
    isArray: false,
  })
  @ApiOperation({
    summary: 'Get Permit by ID',
    description:
      'Fetches a single permit detail by its permit ID for the current user.',
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId')
  async getByPermitId(
    @Req() request: Request,
    @Param('permitId') permitId: string,
  ): Promise<ReadPermitDto> {
    const currentUser = request.user as IUserJWT;
    return this.permitService.findByPermitId(permitId, currentUser);
  }

  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @ApiOperation({
    summary: 'Retrieve PDF',
    description:
      'Retrieves the DOPS file for a given permit ID. Requires READ_PERMIT role.',
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId/pdf')
  async getPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Res() res: Response,
  ): Promise<void> {
    const currentUser = request.user as IUserJWT;

    await this.permitService.findPDFbyPermitId(
      currentUser,
      permitId,
      FileDownloadModes.PROXY,
      res,
    );
    res.status(200);
  }

  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @ApiOperation({
    summary: 'Get Receipt PDF',
    description:
      'Retrieves a PDF receipt for a given permit ID, ensuring the user has read permission.',
  })
  @Roles(Role.READ_PERMIT)
  @Get('/:permitId/receipt')
  async getReceiptPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Res() res: Response,
  ): Promise<void> {
    const currentUser = request.user as IUserJWT;

    await this.permitService.findReceiptPDF(currentUser, permitId, res);
    res.status(200);
  }

  /**
   * A POST method defined with the @Post() decorator and a route of /:permitId/void
   * that Voids or revokes a permit for given @param permitId by changing it's status to VOIDED|REVOKED.
   * @param request
   * @param permitId
   * @param voidPermitDto
   * @returns The id of new voided/revoked permit a in response object {@link ResultDto}
   *
   */
  @Roles(Role.VOID_PERMIT)
  @Post('/:permitId/void')
  async voidpermit(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Body()
    voidPermitDto: VoidPermitDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;
    const permit = await this.permitService.voidPermit(
      permitId,
      voidPermitDto,
      currentUser,
    );
    return permit;
  }

  /**
   * Sends a notification related to a specific permit.
   *
   * This method checks if the current user belongs to the specified user authentication group before proceeding.
   * If the user does not belong to the required auth group, a ForbiddenException is thrown.
   *
   * @param request The incoming request object containing the current user information.
   * @param permitId The ID of the permit to associate the notification with.
   * @param createNotificationDto The data transfer object containing the notification details.
   * @returns A promise resolved with the details of the sent notification.
   */
  @ApiCreatedResponse({
    description: 'The Notification resource with transaction details',
    type: ReadNotificationDto,
  })
  @ApiOperation({
    summary: 'Send Permit Notification',
    description:
      'Sends a notification related to a specific permit after checking user authorization.',
  })
  @Roles(Role.SEND_NOTIFICATION)
  @Post('/:permitId/notification')
  async notification(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Body()
    createNotificationDto: CreateNotificationDto,
  ): Promise<ReadNotificationDto> {
    const currentUser = request.user as IUserJWT;

    // Throws ForbiddenException if user does not belong to the specified user auth group.
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      )
    ) {
      throw new ForbiddenException();
    }

    return await this.permitService.sendNotification(
      currentUser,
      permitId,
      createNotificationDto,
    );
  }
}
