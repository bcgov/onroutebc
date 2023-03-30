import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
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
import {
  CompanyDirectory,
  UserDirectory,
} from '../../../common/enum/directory.enum';
import { ReadCompanyMetadataDto } from './dto/response/read-company-metadata.dto';
import { UserModel } from 'src/modules/common/model/user.model';

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
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(
      createCompanyDto,
      CompanyDirectory.BBCEID,
      'ASMITH', //! Hardcoded value to be replaced by user name from access token
      UserDirectory.BBCEID,
    );
  }

  /**
   * A GET method defined with the @Get(':companyId') decorator and a route of
   * /company/:companyId that retrieves a company by its id.
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyId The company Id.
   *
   * @returns The company details with response object {@link ReadCompanyDto}.
   */
  @ApiOkResponse({
    description: 'The Company Resource',
    type: ReadCompanyDto,
  })
  @Get(':companyId')
  async get(@Param('companyId') companyId: number): Promise<ReadCompanyDto> {
    const company = await this.companyService.findOne(companyId);
    if (!company) {
      throw new DataNotFoundException();
    }
    return company;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /companies that retrieves a company metadata by userGuid.
   * TODO: Secure endpoints once login is implemented.
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
  @Get()
  async getCompanyMetadata(
    @Request() req,
    @Query('userGUID') userGUID?: string,
  ): Promise<ReadCompanyMetadataDto[]> {
    let company: ReadCompanyMetadataDto[] = [] as ReadCompanyMetadataDto[];
    const userModel: UserModel = req.userModel;
    if (userGUID) {
      company = await this.companyService.findCompanyMetadataByUserGuid(
        userGUID,
      );
    } else {
      company = await this.companyService.findCompanyMetadataByUserGuid(
        userModel.userGUID,
      );
    }

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
   *
   * @param companyId The company Id.
   *
   * @returns The updated company deails with response object {@link ReadCompanyDto}.
   */
  @ApiOkResponse({
    description: 'The Company Resource',
    type: ReadCompanyDto,
  })
  @Put(':companyId')
  async update(
    @Param('companyId') companyId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ReadCompanyDto> {
    const powerUnitType = await this.companyService.update(
      companyId,
      updateCompanyDto,
      CompanyDirectory.BBCEID,
    );
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }
}
