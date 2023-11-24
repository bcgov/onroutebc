import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { Get, Query, Req } from '@nestjs/common/decorators';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ReadUserDto } from './dto/response/read-user.dto';
import { UsersService } from './users.service';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';
import { getDirectory } from '../../../common/helper/auth.helper';
import { IUserJWT } from '../../../common/interface/user-jwt.interface';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UpdateUserStatusDto } from './dto/request/update-user-status.dto';

@ApiTags('Company and User Management - Company User')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
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
   * A GET method defined with the @Get() decorator and a route of
   * companies/:companyId/users that retrieves a list of users associated with
   * the company ID
   *
   * @param companyId The company Id.
   * @param pendingUser Optional Query Param to include pending Users.
   *
   * @returns The user list with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @ApiParam({ name: 'companyId', required: true })
  @ApiQuery({ name: 'includePendingUser', required: false, example: false })
  @Roles(Role.READ_SELF)
  @Get()
  async findAllCompanyUsers(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Query('includePendingUser') includePendingUser?: string,
  ) {
    const pendingUser = includePendingUser === 'true';
    return await this.userService.findUsersDto(
      undefined,
      [companyId],
      pendingUser,
    );
  }

  /**
   * A POST method defined with the @Post() decorator and a route of
   * company/:companyId/user that creates a new user associated to a company.
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
      directory,
      currentUser,
    );
  }

  /**
   * A PUT method defined with the @Put(':userGUID') decorator and a route of
   * /companies/:companyId/users/:userGUID that updates a user details by its GUID.
   *
   * @param companyId The company Id.
   * @param userGUID The GUID of the user.
   *
   * @returns The updated user deails with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Roles(Role.WRITE_SELF)
  @Put(':userGUID')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const currentUser = request.user as IUserJWT;
    const directory = getDirectory(currentUser);
    const user = await this.userService.update(
      userGUID,
      updateUserDto,
      companyId,
      directory,
      currentUser,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }

  /**
   * A PUT method defined with the @Put(':userGUID/status/:statusCode')
   * decorator and a route of
   * company/:companyId/user/:userGUID/status/ that updates the
   * user status by its GUID.
   * ? This end point maybe merged with user update endpoint. TBD.
   *
   * @param companyId The company Id.
   * @param userGUID The userGUID
   *
   * @returns True on successfull operation.
   */
  @ApiOkResponse({
    description: '{statusUpdated : true}',
  })
  @Roles(Role.WRITE_SELF)
  @Put(':userGUID/status')
  async updateStatus(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('userGUID') userGUID: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<object> {
    const currentUser = request.user as IUserJWT;
    const directory = getDirectory(currentUser);
    const updateResult = await this.userService.updateStatus(
      userGUID,
      updateUserStatusDto.statusCode,
      directory,
      currentUser,
    );
    if (updateResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { statusUpdated: true };
  }
}
