import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { CompanyUserRoleDto } from 'src/modules/common/dto/response/company-user-role.dto';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { ReadUserExistsDto } from './dto/response/read-user-exists.dto';
import { UsersService } from './users.service';

@ApiTags('Company and User Management - User')
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
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * A GET method defined with the @Get(':userGUID') decorator and a route of
   * /user/:userGUID that verifies if the user exists in ORBC and retrieves
   * the user by its GUID (global unique identifier) and associated company, if any.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Remove temporary placeholder
   *
   * @param userGUID A temporary placeholder parameter to get the user by GUID.
   *        Will be removed once login system is implemented.
   * @param userName A temporary placeholder parameter to get the userName.
   *        Will be removed once login system is implemented.
   * @param companyGUID A temporary placeholder parameter to get the company GUID.
   *        Will be removed once login system is implemented.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Exists Resource',
    type: ReadUserExistsDto,
  })
  @ApiQuery({ name: 'companyGUID', required: false })
  @Get(':userGUID')
  async find(
    @Param('userGUID') userGUID: string,
    @Query('userName') userName: string,
    @Query('companyGUID') companyGUID?: string,
  ): Promise<ReadUserExistsDto> {
    const userExists = await this.userService.findORBCUser(
      userGUID,
      userName,
      companyGUID,
    );
    return userExists;
  }

  /**
   * A GET method defined with the @Get(':userGUID/companies') decorator and a route of
   * /user/:userGUID/companies it retrieves the user and roles by
   * its GUID (global unique identifier) and associated companies, if any.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Remove temporary placeholder
   *
   * @param userGUID A temporary placeholder parameter to get the user by GUID.
   *        Will be removed once login system is implemented.
   * @Query companyId A temporary placeholder parameter to get the company Id.
   *        Will be removed once login system is implemented.
   *
   * @returns The user details with response object {@link CompanyUserRoleDto}.
   */
  @Get(':userGUID/companies')
  findUserCompanyRoles(
    @Param('userGUID') userGUID: string,
    @Query('companyGUID') companyId?: number,
  ): Promise<CompanyUserRoleDto[]> {
    if (companyId) {
      //findUserDetailsWithCompanyId(userGUID,companyId)
    } else {
      //findUserDetailsForAllCompanies(userGuid)
    }
    return;
  }

  /**
   * A GET method defined with the @Get(':userGUID/roles') decorator and a route of
   * /user/:userGUID/roles it retrieves the user and roles by
   * its GUID (global unique identifier) and associated companies, if any.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Remove temporary placeholder
   *
   * @param userGUID A temporary placeholder parameter to get the user by GUID.
   *        Will be removed once login system is implemented.
   * @Query companyId A temporary placeholder parameter to get the company Id.
   *        Will be removed once login system is implemented.
   *
   * @returns The user details with response object {@link CompanyUserRoleDto}.
   */
  @Get(':userGUID/roles')
  async findUserRoles(
    @Param('userGUID') userGUID: string,
    @Query('companyId') companyId?: number,
  ): Promise<CompanyUserRoleDto[]> {
    if (companyId) {
      console.log('company ID is ', companyId);
      const companyUserRole =
        await this.userService.findUserDetailsWithCompanyId(
          userGUID,
          companyId,
        );
      if (!companyUserRole) {
        throw new DataNotFoundException();
      }
      return companyUserRole;
    } else {
      console.log('Without Company ID', companyId);
      const companyUserRole =
        await this.userService.findUserDetailsForAllCompanies(userGUID);
      if (!companyUserRole) {
        throw new DataNotFoundException();
      }
      return companyUserRole;
    }
  }
}
