import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Query,
  ForbiddenException,
  UseGuards,
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
  ApiOperation,
} from '@nestjs/swagger';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { Request } from 'express';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { ResultDto } from './dto/response/result.dto';
import { VoidPermitDto } from './dto/request/void-permit.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginate-response';
import { GetPermitQueryParamsDto } from './dto/request/queryParam/getPermit.query-params.dto';
import { IDIR_USER_AUTH_GROUP_LIST } from 'src/common/enum/user-auth-group.enum';
import { ReadPermitMetadataDto } from './dto/response/read-permit-metadata.dto';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';
import { CreateNotificationDto } from '../../common/dto/request/create-notification.dto';
import { ReadNotificationDto } from '../../common/dto/response/read-notification.dto';
import { PermitReceiptDocumentService } from '../permit-receipt-document/permit-receipt-document.service';
import { JwtServiceAccountAuthGuard } from 'src/common/guard/jwt-sa-auth.guard';

@ApiBearerAuth()
@ApiTags('Permit: API accessible exclusively to staff users.')
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
  constructor(
    private readonly permitService: PermitService,
    private readonly permitReceiptDocumentService: PermitReceiptDocumentService,
  ) {}

  /**
   * Get Permits of Logged in user
   * @Query companyId Company id of logged in user
   * @param status if true get active permits else get others
   *
   */
  @ApiPaginatedResponse(ReadPermitMetadataDto)
  @Roles({
    userAuthGroup: IDIR_USER_AUTH_GROUP_LIST,
    oneOf: [Role.READ_PERMIT],
  })
  @Get()
  async getPermit(
    @Req() request: Request,
    @Query() getPermitQueryParamsDto: GetPermitQueryParamsDto,
  ): Promise<PaginationDto<ReadPermitMetadataDto>> {
    const currentUser = request.user as IUserJWT;

    return await this.permitService.findPermit({
      page: getPermitQueryParamsDto.page,
      take: getPermitQueryParamsDto.take,
      orderBy: getPermitQueryParamsDto.orderBy,
      companyId: null,
      expired: getPermitQueryParamsDto.expired,
      searchColumn: getPermitQueryParamsDto.searchColumn,
      searchString: getPermitQueryParamsDto.searchString,
      userGUID: null,
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

  /**
   * A POST method defined with the @Post() decorator and a route of /:permitId/void
   * that Voids or revokes a permit for given @param permitId by changing it's status to VOIDED|REVOKED.
   * @param request
   * @param permitId
   * @param voidPermitDto
   * @returns The id of new voided/revoked permit a in response object {@link ResultDto}
   *
   */
  @Roles({
    userAuthGroup: IDIR_USER_AUTH_GROUP_LIST,
    oneOf: [Role.VOID_PERMIT],
  })
  @Post('/:permitId/void')
  async voidpermit(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Body()
    voidPermitDto: VoidPermitDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;
    const { result, voidRevokedPermitId } = await this.permitService.voidPermit(
      permitId,
      voidPermitDto,
      currentUser,
    );

    if (voidRevokedPermitId) {
      await Promise.allSettled([
        this.permitReceiptDocumentService.generatePermitDocuments(currentUser, [
          voidRevokedPermitId,
        ]),
        this.permitReceiptDocumentService.generateReceiptDocuments(
          currentUser,
          [voidRevokedPermitId],
        ),
      ]);
    }
    return result;
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
  @Roles({
    userAuthGroup: IDIR_USER_AUTH_GROUP_LIST,
    oneOf: [Role.SEND_NOTIFICATION],
  })
  @Post('/:permitId/notification')
  async notification(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Body()
    createNotificationDto: CreateNotificationDto,
  ): Promise<ReadNotificationDto[]> {
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

  @UseGuards(JwtServiceAccountAuthGuard)
  @Post('/scheduler/issue')
  issuePermit() {
    console.log('Issue Permit Scheduler');
    return 'success';
  }

  @UseGuards(JwtServiceAccountAuthGuard)
  @Post('/scheduler/document')
  generateDocument() {
    console.log('Generate Document Scheduler');
    return 'success';
  }
}
