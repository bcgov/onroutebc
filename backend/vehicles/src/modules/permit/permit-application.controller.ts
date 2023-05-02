import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { IDP } from 'src/common/enum/idp.enum';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { CreatePermitApplicationDto } from './dto/request/create-permit-application.dto';
import { ReadPermitApplicationDto } from './dto/response/read-permit-application.dto';
import { PermitApplicationService } from './permit-application.service';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('permits/applications')
export class PermitApplicationController {
  constructor(
    private readonly permitApplicationService: PermitApplicationService,
  ) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Resource',
    type: ReadPermitApplicationDto,
  })
  @Post()
  async createPermitApplication(
    @Body() createPermitApplication: CreatePermitApplicationDto,
    @Req() request: Request,
  ): Promise<ReadPermitApplicationDto> {
    const currentUser = request.user as IUserJWT;
    return await this.permitApplicationService.create(
      createPermitApplication,
      currentUser.userGUID,
      createPermitApplication.companyId,
    );
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPermitApplicationDto,
    isArray: true,
  })
  @Get()
  async findAllApplication(
    @Req() request: Request,
    @Query('companyId') companyId?: string,
  ): Promise<ReadPermitApplicationDto[]> {
    const currentUser = request.user as IUserJWT;
    if (currentUser.identity_provider == IDP.IDIR) {
      return await this.permitApplicationService.findAllApplicationCompany(
        companyId,
      );
    } else {
      return await this.permitApplicationService.findAllApplicationUser(
        companyId,
        currentUser.userGUID,
      );
    }
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPermitApplicationDto,
    isArray: true,
  })
  @Get(':permitId')
  async findOneApplication(
    @Req() request: Request,
    @Param('permitId') permitId: string,
  ): Promise<ReadPermitApplicationDto> {
    return await this.permitApplicationService.findApplication(permitId);
  }
}
