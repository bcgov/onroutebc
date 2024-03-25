import {
  Controller,
  ForbiddenException,
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
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { IDIR_USER_AUTH_GROUP_LIST } from 'src/common/enum/user-auth-group.enum';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginate-response';
import { GetApplicationQueryParamsDto } from './dto/request/queryParam/getApplication.query-params.dto';
import { PermitApplicationOrigin } from '../../../common/enum/permit-application-origin.enum';
import { ReadApplicationMetadataDto } from './dto/response/read-application-metadata.dto';
import { doesUserHaveAuthGroup } from '../../../common/helper/auth.helper';

@ApiBearerAuth()
@ApiTags('Permit Application - API available for staff users only.')
@Controller('permits/applications')
@ApiNotFoundResponse({
  description: 'The Application Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
  type: ExceptionDto,
})
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  /**
   * Find all application for given status of a company for current logged in user
   * @param request
   * @param companyId
   * @param userGUID
   * @param status
   */
  @ApiOperation({
    summary:
      "Fetch All the Permit Application of PA or Company Based on Logged in User's Claim",
    description:
      'Fetch all permit application and return the same , enforcing authentication.' +
      "If login user is PA then only fetch thier application else fetch all applications associated with logged in user's company. ",
  })
  @ApiPaginatedResponse(ReadApplicationMetadataDto)
  @Roles(Role.READ_PERMIT)
  @Get()
  async findAllApplication(
    @Req() request: Request,
    @Query() getApplicationQueryParamsDto: GetApplicationQueryParamsDto,
  ): Promise<PaginationDto<ReadApplicationMetadataDto>> {
    const currentUser = request.user as IUserJWT;
    return this.applicationService.findAllApplications({
      page: getApplicationQueryParamsDto.page,
      take: getApplicationQueryParamsDto.take,
      orderBy: getApplicationQueryParamsDto.orderBy,
      companyId: null,
      userGUID: null,
      currentUser: currentUser,
    });
  }

  /**
   * Update Applications status to given status.
   * If status is not cancellation the can only update one application at a time.
   * Else also allow bulk cancellation for applications.
   * @param request
   * @param permitId
   * @param companyId for authorization
   */
  @ApiOperation({
    summary: 'Fetch One Permit Application for Given Id',
    description: 'Fetch One Permit Application for given id. ',
  })
  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
    isArray: true,
  })
  @ApiQuery({ name: 'amendment', required: false })
  @Roles(Role.READ_PERMIT)
  @Get(':permitId')
  async findOneApplication(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Query('amendment') amendment?: boolean,
  ): Promise<ReadApplicationDto> {
    // Extracts the user object from the request, casting it to the expected IUserJWT type
    const currentUser = request.user as IUserJWT;

    // Based on the amendment query parameter, selects the appropriate method to retrieve
    // either the application or its current amendment, passing the permitId and current user for authorization and filtering
    const retApplicationDto = !amendment
      ? await this.applicationService.findApplication(permitId, currentUser)
      : await this.applicationService.findCurrentAmendmentApplication(
          permitId,
          currentUser,
        );

    // Validates the current user's permission to access the application or amendment
    // by comparing user's authentication group, company ID, and the application's origin
    if (
      !doesUserHaveAuthGroup(
        currentUser.orbcUserAuthGroup,
        IDIR_USER_AUTH_GROUP_LIST,
      ) &&
      retApplicationDto.permitApplicationOrigin !==
        PermitApplicationOrigin.ONLINE
    ) {
      throw new ForbiddenException(
        `User does not have sufficient privileges to view the application ${permitId}.`,
      );
    }

    if (!retApplicationDto) {
      throw new DataNotFoundException();
    }
    // Returns the found application or amendment DTO
    return retApplicationDto;
  }
}
