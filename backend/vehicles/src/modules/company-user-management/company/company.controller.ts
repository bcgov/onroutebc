import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';

import { CompanyService } from './company.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * Creates a Company and Admin User.
   * @param createCompanyDto The http request object containing the company details.
   * @returns 201
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
      'ASMITH', //TODO : Grab from access token
      UserDirectory.BBCEID,
    );
  }

  /**
   * Retrieves the company corresponding to the user.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadCompanyDto} upon finding the right one.
   */
  @ApiOkResponse({
    description: 'The Company Resource',
    type: ReadCompanyDto,
  })
  @Get(':companyGUID')
  async get(
    @Param('companyGUID') companyGUID: string,
  ): Promise<ReadCompanyDto> {
    const company = await this.companyService.findOne(companyGUID);
    if (!company) {
      throw new DataNotFoundException();
    }
    return company;
  }

  /**
   * Retrieves the company corresponding to the user.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadCompanyDto} upon successfully updating.
   */
  @ApiOkResponse({
    description: 'The Company  Resource',
    type: ReadCompanyDto,
  })
  @Put(':companyGUID')
  async update(
    @Param('companyGUID') companyGUID: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ReadCompanyDto> {
    // Get current company  from the access api ?

    const powerUnitType = await this.companyService.update(
      companyGUID,
      updateCompanyDto,
      CompanyDirectory.BBCEID,
    );
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }
}
