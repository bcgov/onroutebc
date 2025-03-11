import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { ReadCompanyDto } from './dto/response/read-company.dto';
import { ReadCompanyUserDto } from './dto/response/read-company-user.dto';
import { ReadCompanyMetadataDto } from './dto/response/read-company-metadata.dto';
import { Request } from 'express';
import { Permissions } from '../../../common/decorator/permissions.decorator';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { PaginationDto } from 'src/common/dto/paginate/pagination';
import { ApiPaginatedResponse } from '../../../common/decorator/api-paginate-response';
import { GetCompanyQueryParamsDto } from './dto/request/queryParam/getCompany.query-params.dto';

import { ReadVerifyClientDto } from './dto/response/read-verify-client.dto';
import { VerifyClientDto } from './dto/request/verify-client.dto';
import {
  CLIENT_USER_ROLE_LIST,
  ClientUserRole,
  IDIR_USER_ROLE_LIST,
  IDIRUserRole,
} from '../../../common/enum/user-role.enum';
import { doesUserHaveRole } from '../../../common/helper/auth.helper';

@ApiTags('Company and User Management - Company')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
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
@ApiUnprocessableEntityResponse({
  description: 'The Company Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of /company
   * that creates a new company and its admin user.
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
    return await this.companyService.create(createCompanyDto, currentUser);
  }

  /**
   * A GET method defined with the @Get() decorator and a route of /companies
   * that retrieves paginated companies data according to the parameters specified in
   * GetCompanyQueryParamsDto, such as legal name or client number.
   *
   * @param getCompanyQueryParamsDto The query parameters for fetching paginated companies.
   * @returns The paginated companies with response object {@link ReadCompanyDto}.
   */
  @ApiPaginatedResponse(ReadCompanyDto)
  @Permissions({
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
  @Get()
  async getCompanyPaginated(
    @Req() request: Request,
    @Query() getCompanyQueryParamsDto: GetCompanyQueryParamsDto,
  ): Promise<PaginationDto<ReadCompanyDto>> {
    const currentUser = request.user as IUserJWT;
    if (!doesUserHaveRole(currentUser.orbcUserRole, IDIR_USER_ROLE_LIST)) {
      throw new UnauthorizedException(
        `Unauthorized for ${currentUser.orbcUserRole} role.`,
      );
    }

    const companies: PaginationDto<ReadCompanyDto> =
      await this.companyService.findCompanyPaginated({
        page: getCompanyQueryParamsDto.page,
        take: getCompanyQueryParamsDto.take,
        orderBy: getCompanyQueryParamsDto.orderBy,
        companyName: getCompanyQueryParamsDto.companyName,
        clientNumber: getCompanyQueryParamsDto.clientNumber,
      });

    return companies;
  }
  /**
   * A GET method defined with the @Get() decorator and a route of /meta-data
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
  @Permissions({
    allowedBCeIDRoles: CLIENT_USER_ROLE_LIST,
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
  @Get('meta-data')
  async getCompanyMetadata(
    @Req() request: Request,
  ): Promise<ReadCompanyMetadataDto[]> {
    const currentUser = request.user as IUserJWT;

    const company = await this.companyService.findCompanyMetadataByUserGuid(
      currentUser.userGUID,
    );
    if (!company?.length) {
      throw new DataNotFoundException();
    }
    return company;
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
  @Permissions({
    allowedBCeIDRoles: CLIENT_USER_ROLE_LIST,
    allowedIdirRoles: IDIR_USER_ROLE_LIST,
  })
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
   * A PUT method defined with the @Put(':companyId') decorator and a route of
   * /company/:companyId that updates a company by its ID.
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
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.CTPO,
    ],
  })
  @Put(':companyId')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ReadCompanyDto> {
    const currentUser = request.user as IUserJWT;
    const retCompany = await this.companyService.update(
      companyId,
      updateCompanyDto,
      currentUser,
    );
    if (!retCompany) {
      throw new DataNotFoundException();
    }
    return retCompany;
  }

  /**
   * A POST method is defined with a route of /verify-client that verifies
   * the existence of a migrated/OnRouteBC client and their permit in the system.
   * A 422 unprocessable exception will be thrown if it is found that the company has already been claimed in OnRouteBC.
   *
   * @returns The verified client details with response object {@link ReadVerifyClientDto}.
   */
  @ApiCreatedResponse({
    description: 'Verifies a client and returns the verification status',
    type: ReadVerifyClientDto,
  })
  @ApiOperation({
    summary: 'Verify Migrated/onRouteBC Client',
    description:
      'Verifies the existence of a migrated/onRouteBC client and their permit in the database. A 422 unprocessable exception will be thrown if it is found that the company has already been claimed in OnRouteBC.',
  })
  @AuthOnly()
  @Post('verify-client')
  async verifyClient(
    @Req() request: Request,
    @Body() verifyClientDto: VerifyClientDto,
  ): Promise<ReadVerifyClientDto> {
    const currentUser = request.user as IUserJWT;
    return await this.companyService.verifyClient(currentUser, verifyClientDto);
  }
}
