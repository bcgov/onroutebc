import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
}
