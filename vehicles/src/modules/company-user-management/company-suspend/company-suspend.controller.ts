import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { CompanySuspendService } from './company-suspend.service';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreateCompanySuspendDto } from './dto/request/create-company-suspend.dto';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { ReadCompanySuspendActivityDto } from './dto/response/read-company-suspend-activity.dto';
import { Request } from 'express';
import { Permissions } from '../../../common/decorator/permissions.decorator';
import { IDIRUserRole } from '../../../common/enum/user-role.enum';

@ApiTags('Company and User Management - Company Suspend')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Company Suspend Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Company Suspend Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Company Suspend Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('companies/:companyId')
export class CompanySuspendController {
  constructor(private readonly companySuspendService: CompanySuspendService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of /:companyId/suspend
   * that suspends a company based on the company ID provided. It also creates a record of
   * the suspension activity.
   *
   * @param createCompanySuspendDto The http request object containing the suspension details.
   *
   * @returns The details of the suspension activity with
   * response object {@link ReadCompanySuspendActivityDto}
   */
  @ApiCreatedResponse({
    description: 'The Company Suspension Activity Resource',
    type: ReadCompanySuspendActivityDto,
  })
  @Permissions({
    allowedIdirRoles: [
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.FINANCE,
      IDIRUserRole.CTPO,
    ],
  })
  @Post('suspend')
  async suspendCompany(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createCompanySuspendDto: CreateCompanySuspendDto,
  ): Promise<ReadCompanySuspendActivityDto> {
    const currentUser = request.user as IUserJWT;
    return await this.companySuspendService.suspendCompany(
      companyId,
      createCompanySuspendDto,
      currentUser,
    );
  }

  /**
   * A GET method defined with the @Get() decorator and a route of /:companyId/suspend
   * that retrieves all suspend activities by companyId.
   *
   * @param companyId The company Id.
   *
   * @returns The suspend activities with response object {@link ReadCompanySuspendActivityDto}.
   */
  @ApiOkResponse({
    description: 'The Company Suspend Activity Resource',
    type: ReadCompanySuspendActivityDto,
    isArray: true,
  })
  @Permissions({
    allowedIdirRoles: [
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.FINANCE,
      IDIRUserRole.CTPO,
      IDIRUserRole.ENFORCEMENT_OFFICER,
    ],
  })
  @Get('suspend')
  async findAllSuspendActivityByCompanyId(
    @Param('companyId') companyId: number,
  ): Promise<ReadCompanySuspendActivityDto[]> {
    const suspendActivityList =
      await this.companySuspendService.findAllSuspendActivityByCompanyId(
        companyId,
      );
    return suspendActivityList;
  }
}
