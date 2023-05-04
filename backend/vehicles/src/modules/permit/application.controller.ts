import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDP } from 'src/common/enum/idp.enum';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { CreateApplicationDto } from './dto/request/create-application.dto';
import { ReadApplicationDto } from './dto/response/read-application.dto';
import { ApplicationService } from './application.service';
import { Request } from 'express';
import { ExceptionDto } from '../common/dto/exception.dto';
import { UpdateApplicationDto } from './dto/request/update-application.dto';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';

@ApiBearerAuth()
@ApiTags('Permit Application')
@Controller('permits/applications')
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
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @ApiCreatedResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
  })
  @Post()
  async createPermitApplication(
    @Body() createApplication: CreateApplicationDto,
  ): Promise<ReadApplicationDto> {
    return await this.applicationService.create(createApplication);
  }

  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
    isArray: true,
  })
  @Get()
  async findAllApplication(
    @Req() request: Request,
    @Query('companyId') companyId: string,
    @Query('userGUID') userGUID?: string,
    @Query('status') status?: string,
  ): Promise<ReadApplicationDto[]> {
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider == IDP.IDIR) {
      return await this.applicationService.findAllApplicationCompany(
        companyId,
        status,
      );
    } else {
      return await this.applicationService.findAllApplicationUser(
        companyId,
        userGUID,
        status,
      );
    }
  }

  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto,
    isArray: true,
  })
  @Get(':permitId')
  async findOneApplication(
    @Req() request: Request,
    @Param('permitId') permitId: string,
  ): Promise<ReadApplicationDto> {
    return await this.applicationService.findApplication(permitId);
  }

  @ApiOkResponse({
    description: 'The Permit Application Resource',
    type: ReadApplicationDto
  })
  @Put(':applicationNumber')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('applicationNumber') applicationNumber: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<ReadApplicationDto> {

    //console.log('request', request.body)
    //console.log('updateApplicationDto 1', updateApplicationDto)

    const existingApplication = await this.applicationService.findByApplication(applicationNumber);

    updateApplicationDto.applicationNumber = applicationNumber;

    const application = await this.applicationService.update(
      companyId,
      applicationNumber,
      updateApplicationDto,
    );

    //console.log('updateApplicationDto 1', updateApplicationDto)
    
    if (!application) {
      throw new DataNotFoundException();
    }
    return application;
  }
}
