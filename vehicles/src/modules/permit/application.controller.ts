import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { ResultDto } from './dto/response/result.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { IssuePermitDto } from './dto/request/issue-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import {
  UserAuthGroup,
  idirUserAuthGroupList,
} from 'src/common/enum/user-auth-group.enum';
import { ApiPaginatedResponse } from 'src/common/decorator/api-paginate-response';
import { GetApplicationQueryParamsDto } from './dto/request/queryParam/getApplication.query-params.dto';
import { DeleteApplicationDto } from './dto/request/delete-application.dto';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import {
  getActiveApplicationStatus,
  getInActiveApplicationStatus,
} from 'src/common/helper/application.status.helper';

@ApiBearerAuth()
@ApiTags('Permit Application')
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
   * Create Permit application
   * @param request
   * @param createApplication
   */
  @ApiCreatedResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
  })
  @Roles(Role.WRITE_PERMIT)
  @Post()
  async createPermitApplication(
    @Req() request: Request,
    @Body() createApplication: CreateApplicationDto,
  ): Promise<ReadApplicationDto> {
    const currentUser = request.user as IUserJWT;
    return await this.applicationService.create(createApplication, currentUser);
  }

  /**
   * Find all application for given status of a company for current logged in user
   * @param request
   * @param companyId
   * @param userGUID
   * @param status
   */
  @ApiPaginatedResponse(ReadPermitDto)
  @Roles(Role.READ_PERMIT)
  @Get()
  async findAllApplication(
    @Req() request: Request,
    @Query() getApplicationQueryParamsDto: GetApplicationQueryParamsDto,
  ): Promise<PaginationDto<ReadApplicationDto>> {
    const currentUser = request.user as IUserJWT;
    if (
      !idirUserAuthGroupList.includes(
        currentUser.orbcUserAuthGroup as UserAuthGroup,
      ) &&
      !getApplicationQueryParamsDto.companyId
    ) {
      throw new BadRequestException(
        `Company Id is required for roles except ${idirUserAuthGroupList.join(', ')}.`,
      );
    }

    const userGuid =
      UserAuthGroup.CV_CLIENT === currentUser.orbcUserAuthGroup
        ? currentUser.userGUID
        : null;
    const applicationStatus: Readonly<ApplicationStatus[]> =
      getActiveApplicationStatus(currentUser);
    return this.applicationService.findAllApplications(applicationStatus, {
      page: getApplicationQueryParamsDto.page,
      take: getApplicationQueryParamsDto.take,
      orderBy: getApplicationQueryParamsDto.orderBy,
      companyId: getApplicationQueryParamsDto.companyId,
      userGUID: userGuid,
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
  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'amendment', required: false })
  @Roles(Role.READ_PERMIT)
  @Get(':permitId')
  async findOneApplication(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Query('amendment') amendment?: boolean,
  ): Promise<ReadApplicationDto | ReadPermitDto> {
    return !amendment
      ? this.applicationService.findApplication(permitId)
      : this.applicationService.findCurrentAmendmentApplication(permitId);
  }

  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
  })
  @Roles(Role.WRITE_PERMIT)
  @Put(':applicationNumber')
  async update(
    @Req() request: Request,
    @Param('applicationNumber') applicationNumber: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<ReadApplicationDto> {
    const currentUser = request.user as IUserJWT;
    const application = await this.applicationService.update(
      applicationNumber,
      updateApplicationDto,
      currentUser,
    );

    if (!application) {
      throw new DataNotFoundException();
    }
    return application;
  }

  /**
   * A POST method defined with the @Post() decorator and a route of /:applicationId/issue
   * that issues a ermit for given @param applicationId..
   * @param request
   * @param issuePermitDto
   * @returns The id of new voided/revoked permit a in response object {@link ResultDto}
   *
   */
  @Roles(Role.WRITE_PERMIT)
  @Post('/issue')
  async issuePermit(
    @Req() request: Request,
    @Body() issuePermitDto: IssuePermitDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;

    if (
      !idirUserAuthGroupList.includes(
        currentUser.orbcUserAuthGroup as UserAuthGroup,
      ) &&
      !issuePermitDto.companyId
    ) {
      throw new BadRequestException(
        `Company Id is required for roles except ${idirUserAuthGroupList.join(', ')}.`,
      );
    }

    /**Bulk issuance would require changes in issuePermit service method with
     *  respect to Document generation etc. At the moment, it is not handled and
     *  only single permit Id must be passed.
     *
     */
    const result = await this.applicationService.issuePermit(
      currentUser,
      issuePermitDto.applicationIds[0],
    );
    return result;
  }

  @Roles(Role.WRITE_PERMIT)
  @Delete()
  @ApiOperation({
    summary:
      'Delete application in progress associated with a company and user(optional)',
    description:
      'Allows deletion of one or more applications in progress associated with a given company ID, based on user GUIDs(user GUID needed only for CV clients). ' +
      'Requires specific user roles or group memberships to execute.' +
      'Returns a list of deleted applications or throws exceptions for unauthorized access or operational failures.',
  })
  async deleteApplications(
    @Req() request: Request,
    @Body() deleteApplicationDto: DeleteApplicationDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT;
    const userGuid =
      UserAuthGroup.CV_CLIENT === currentUser.orbcUserAuthGroup
        ? currentUser.userGUID
        : null;
    const applicationStatus: Readonly<ApplicationStatus[]> =
      getActiveApplicationStatus(currentUser);

    const deletionStatus: ApplicationStatus =
      getInActiveApplicationStatus(currentUser);

    const deleteResult: ResultDto =
      await this.applicationService.deleteApplicationInProgress(
        deleteApplicationDto.applications,
        deletionStatus,
        applicationStatus,
        deleteApplicationDto.companyId,
        currentUser,
        userGuid,
      );
    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }
}
