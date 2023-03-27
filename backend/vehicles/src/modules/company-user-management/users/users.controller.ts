import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserDirectory } from '../../../common/enum/directory.enum';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ReadUserOrbcStatusDto } from './dto/response/read-user-orbc-status.dto';
import { ReadUserDto } from './dto/response/read-user.dto';
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
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * A GET method defined with the @Get(':userGUID') decorator and a route of
   * /user-company/:userGUID that verifies if the user exists in ORBC and retrieves
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
   * @returns The user details with response object {@link ReadUserOrbcStatusDto}.
   */
  @ApiOkResponse({
    description: 'The User Orbc Status Exists Resource',
    type: ReadUserOrbcStatusDto,
  })
  @ApiQuery({ name: 'companyGUID', required: false })
  @Get('user-company/:userGUID')
  async find(
    @Param('userGUID') userGUID: string,
    @Query('userName') userName: string,
    @Query('companyGUID') companyGUID?: string,
  ): Promise<ReadUserOrbcStatusDto> {
    const userExists = await this.userService.findORBCUser(
      userGUID,
      userName,
      companyGUID,
    );
    return userExists;
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * /users/  that retrieves a user by its GUID
   * (global unique identifier).
   * TODO: Secure endpoints once login is implemented.
   *
   * @param userGUID  The optional user GUID. If unavailable, the userGUID from the token will be used.
   *
   * @returns The user details with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @ApiQuery({ name: 'userGUID', required: false })
  @Get()
  async findUserDetails(
    @Query('userGUID') userGUID: string,
  ): Promise<ReadUserDto> {
    const companyUser = await this.userService.findUserbyUserGUID(userGUID);
    if (!companyUser) {
      throw new DataNotFoundException();
    }
    return companyUser;
  }

  /**
   * A PUT method defined with the @Put(':userGUID') decorator and a route of
   * user/:userGUID that updates a user details by its GUID.
   * TODO: Secure endpoints once login is implemented.
   * TODO: Grab user name from the access token and remove the hard coded value 'ASMITH'.
   * TODO: Grab user directory from the access token and remove the hard coded value UserDirectory.BBCEID.
   *
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   *
   * @returns The updated user deails with response object {@link ReadUserDto}.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Put(':userGUID')
  async update(
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.userService.update(
      userGUID,
      'ASMITH', //! Hardcoded value to be replaced by user name from access token
      UserDirectory.BBCEID, //! Hardcoded value to be replaced by user directory from access token
      updateUserDto,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }
}
