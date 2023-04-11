import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { Query, Req } from '@nestjs/common/decorators';

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
import { UserStatus } from '../../../common/enum/user-status.enum';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ReadUserDto } from './dto/response/read-user.dto';
import { UsersService } from './users.service';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import {
  validateUserCompanyAndRoleForUserGuidQueryParam,
  getDirectory,
} from '../../../common/helper/auth.helper';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';
import { Directory } from '../../../common/enum/directory.enum';
import { UpdateUserDto } from './dto/request/update-user.dto';

@ApiTags('Company and User Management - Company User')
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
@ApiBearerAuth()
@Controller('companies/:companyId/users')
export class CompanyUsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of
   * company/:companyId/user that creates a new user associated to a company.
   * TODO: Validations on {@link CreateUserDto}.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Grab user name from the access token and remove the hard coded value 'ASMITH'.
   *
   * @param createUserDto The http request object containing the user details.
   *
   * @returns The details of the new user with response object
   * {@link ReadUserDto}
   */
  @ApiCreatedResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @AuthOnly()
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    const currentUser = request.user as IUserJWT;
    const directory = getDirectory(currentUser);

    return await this.userService.create(
      createUserDto,
      companyId,
      currentUser.userName,
      directory,
    );
  }

  /**
   * A PUT method defined with the @Put(':userGUID') decorator and a route of
   * /companies/:companyId/users/:userGUID that updates a user details by its GUID.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Grab user name from the access token and remove the hard coded value 'ASMITH'.
   * TODO: Grab user directory from the access token and remove the hard coded value Directory.BBCEID.
   *
   * @param userGUID The GUID of the user.
   *
   * @returns The updated user deails with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Put(':userGUID')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    //const currentUser = request.user as IUserJWT;
    const user = await this.userService.update(
      userGUID,
      'ASMITH', //! Hardcoded value to be replaced by user name from access token
      Directory.BBCEID, //! Hardcoded value to be replaced by user directory from access token
      updateUserDto,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }

  /**
   * A PUT method defined with the @Put(':userGUID/status/:statusCode')
   * decorator and a route of
   * company/:companyId/user/:userGUID/status/:statusCode that updates the
   * user status by its GUID.
   * ? This end point maybe merged with user update endpoint. TBD.
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyId The company Id.
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   * @param statusCode The status Code of the user of type {@link UserStatus}
   *
   * @returns True on successfull operation.
   */
  @ApiOkResponse({
    description: '{statusUpdated : true}',
  })
  @ApiQuery({ name: 'code', enum: UserStatus })
  @ApiQuery({ name: 'userGUID', required: false })
  @Roles(Role.WRITE_SELF, Role.WRITE_USER)
  @Put(':userGUID/status')
  async updateStatus(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Query('code') statusCode: UserStatus,
    @Query('userGUID') userGUID?: string,
  ): Promise<object> {
    const currentUser = request.user as IUserJWT;
    const userCompanies = userGUID
      ? await this.userService.getCompaniesForUser(userGUID)
      : undefined;
    validateUserCompanyAndRoleForUserGuidQueryParam(
      [Role.READ_ORG],
      userGUID,
      userCompanies,
      currentUser,
    );
    userGUID = userGUID ? userGUID : currentUser.userGUID;

    const updateResult = await this.userService.updateStatus(
      companyId,
      userGUID,
      statusCode,
    );
    if (updateResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { statusUpdated: true };
  }
}
