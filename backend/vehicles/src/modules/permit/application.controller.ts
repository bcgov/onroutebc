import {
  Body,
  Controller,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IDP } from 'src/common/enum/idp.enum';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { UpdateApplicationStatusDto } from './dto/request/update-application-status.dto';
import { ResultDto } from './dto/response/result.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

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
  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
    isArray: true,
  })
  @ApiQuery({ name: 'companyId', required: false })
  @Roles(Role.READ_PERMIT)
  @Get()
  async findAllApplication(
    @Req() request: Request,
    @Query('companyId') companyId?: number,
    @Query('status') status?: ApplicationStatus,
  ): Promise<ReadApplicationDto[]> {
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider == IDP.IDIR) {
      return this.applicationService.findAllApplicationCompany(
        companyId,
        status,
      );
    } else {
      return this.applicationService.findAllApplicationUser(
        companyId,
        currentUser.userGUID,
        status,
      );
    }
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
  @Roles(Role.READ_PERMIT)
  @Get(':permitId')
  async findOneApplication(
    @Req() request: Request,
    @Param('permitId') permitId: string,
  ): Promise<ReadApplicationDto> {
    return this.applicationService.findApplication(permitId);
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
    const application = await this.applicationService.update(
      applicationNumber,
      updateApplicationDto,
    );

    if (!application) {
      throw new DataNotFoundException();
    }
    return application;
  }

  /**
   * Update application Data.
   * @param request
   * @param updateApplicationStatusDto
   */
  @ApiOkResponse({
    description:
      'The Permit Application Resource. Bulk staus updates are only allowed for Cancellation. Application/Permit Status change to ISSUE is prohibited on this endpoint.',
    type: ResultDto,
  })
  //TODO Assign role. Should have a different role like @Roles(Role.WRITE_PERMIT_STATUS) .
  @Post('status')
  async updateApplicationStatus(
    @Req() request: Request,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ): Promise<ResultDto> {
    const currentUser = request.user as IUserJWT; // TODO: consider security with passing JWT token to DMS microservice
    const result = await this.applicationService.updateApplicationStatus(
      updateApplicationStatusDto.applicationIds,
      updateApplicationStatusDto.applicationStatus,
      currentUser,
    );
    if (!result) {
      throw new DataNotFoundException();
    }
    return result;
  }
}
