import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
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
        currentUser.userGUID,
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
}
