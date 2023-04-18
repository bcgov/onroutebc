import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
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
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ReadCompanyDto } from './dto/response/read-company.dto';
import { ReadCompanyUserDto } from './dto/response/read-company-user.dto';
import { Directory } from '../../../common/enum/directory.enum';
import { ReadCompanyMetadataDto } from './dto/response/read-company-metadata.dto';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { getDirectory, matchRoles } from '../../../common/helper/auth.helper';
import { IDP } from '../../../common/enum/idp.enum';

@ApiTags('Company and User Management - Company')
@ApiNotFoundResponse({
  description: 'The Company Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Company Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Company Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of /company
   * that creates a new company and its admin user.
   * TODO: Validations on {@link CreateCompanyDto}.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Grab user name from the access token and remove the hard coded value 'ASMITH'.
   *
   * @param createCompanyDto The http request object containing the company and
   * admin user details.
   *
   * @returns The details of the new company and its associated admin user with
   * response object {@link ReadCompanyUserDto}
   */
  @ApiCreatedResponse({
    description: 'The Company-User Resource',
    type: ReadCompanyUserDto,
  })
  @AuthOnly()
  @Post()
  async create(
    @Req() request: Request,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    const currentUser = request.user as IUserJWT;
    const directory = getDirectory(currentUser);

    return await this.companyService.create(
      createCompanyDto,
      directory,
      currentUser,
    );
  }

  /**
   * A GET method defined with the @Get(':companyId') decorator and a route of
   * /company/:companyId that retrieves a company by its id.
   *
   * @param companyId The company Id.
   *
   * @returns The company details with response object {@link ReadCompanyDto}.
   */
  @ApiOkResponse({
    description: 'The Company Resource',
    type: ReadCompanyDto,
  })
  @Roles(Role.READ_ORG)
  @Get(':companyId')
  async get(
    @Req() request: Request,
    @Param('companyId') companyId: number,
  ): Promise<ReadCompanyDto> {
    const company = await this.companyService.findOne(companyId);
    if (!company) {
      throw new DataNotFoundException();
    }
    return company;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of /companies
   * that retrieves a company metadata by userGuid. If userGUID is not provided,
   * the guid will be grabbed from the token.
   *
   * @param userGUID The user Guid.
   *
   * @returns The company details with response object {@link ReadCompanyMetadataDto}.
   */
  @ApiOkResponse({
    description: 'The Company Metadata Resource',
    type: ReadCompanyMetadataDto,
    isArray: true,
  })
  @ApiQuery({ name: 'userGUID', required: false })
  @Roles(Role.READ_SELF, Role.READ_ORG)
  @Get()
  async getCompanyMetadata(
    @Req() request: Request,
    @Query('userGUID') userGUID?: string,
  ): Promise<ReadCompanyMetadataDto[]> {
    const currentUser = request.user as IUserJWT;
    const rolesExists = matchRoles([Role.READ_ORG], currentUser.roles);

    if (
      userGUID &&
      (!rolesExists ||
        (rolesExists && currentUser.identity_provider !== IDP.IDIR))
    ) {
      throw new ForbiddenException();
    }

    userGUID = userGUID ? userGUID : currentUser.userGUID;
    const company = await this.companyService.findCompanyMetadataByUserGuid(
      userGUID,
    );
    if (!company) {
      throw new DataNotFoundException();
    }
    return company;
  }

  /**
   * A PUT method defined with the @Put(':companyId') decorator and a route of
   * /company/:companyId that updates a company by its ID.
   * TODO: Validations on {@link UpdateCompanyDto}.
   * TODO: Secure endpoints once login is implemented.
   * ? Should the company Directory be updated
   *
   * @param companyId The company Id.
   *
   * @returns The updated company deails with response object {@link ReadCompanyDto}.
   */
  @ApiOkResponse({
    description: 'The Company Resource',
    type: ReadCompanyDto,
  })
  @Roles(Role.WRITE_ORG)
  @Put(':companyId')
  async update(
    @Param('companyId') companyId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ReadCompanyDto> {
    const powerUnitType = await this.companyService.update(
      companyId,
      updateCompanyDto,
      Directory.BBCEID,
    );
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }
}
