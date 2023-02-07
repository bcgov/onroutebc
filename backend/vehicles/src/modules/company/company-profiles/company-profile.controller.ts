import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CreateCompanyProfileDto } from './dto/request/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/request/update-company-profile.dto';
import { CompanyProfileService } from './company-profile.service';
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
import { ReadCompanyProfileDto } from './dto/response/read-company-profile.dto';

@ApiTags('Company Profile')
@ApiNotFoundResponse({
  description: 'The Company Profile Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Company Profile Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Company Profile Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  /**
   * Creates a company profile.
   * @param createCompanyProfileDto The http request object containing the company profile details.
   * @returns 201
   */
  @ApiCreatedResponse({
    description: 'The Company Profile Resource',
    type: ReadCompanyProfileDto,
  })
  @Post()
  create(@Body() createCompanyProfileDto: CreateCompanyProfileDto) {
    return this.companyProfileService.create(createCompanyProfileDto);
  }

  /**
   * Retrieves the company profile corresponding to the user.
   * @param companyGUID A temporary placeholder parameter to get the company profile by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadCompanyProfileDto} upon finding the right one.
   */
  @ApiOkResponse({
    description: 'The Company Profile Resource',
    type: ReadCompanyProfileDto,
  })
  @Get(':companyGUID')
  async get(
    @Param('companyGUID') companyGUID: string,
  ): Promise<ReadCompanyProfileDto> {
    const companyProfile = await this.companyProfileService.findOne(
      companyGUID,
    );
    if (!companyProfile) {
      throw new DataNotFoundException();
    }
    return companyProfile;
  }

  /**
   * Retrieves the company profile corresponding to the user.
   * @param companyGUID A temporary placeholder parameter to get the company profile by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadCompanyProfileDto} upon successfully updating.
   */
  @ApiOkResponse({
    description: 'The Company Profile Resource',
    type: ReadCompanyProfileDto,
  })
  @Put(':companyGUID')
  async update(
    @Param('companyGUID') companyGUID: string,
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
  ): Promise<ReadCompanyProfileDto> {
    // Get current company profile from the access api ?

    const powerUnitType = await this.companyProfileService.update(
      companyGUID,
      updateCompanyProfileDto,
    );
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }
}
