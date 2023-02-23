import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDirectory } from '../../../common/enum/directory.enum';
import { UserStatus } from '../../../common/enum/user-status.enum';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
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
@Controller('company/:companyGUID/user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Creates a user.
   * @param createUserDto The http request object containing the user details.
   * @returns 201
   */
  @ApiCreatedResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Post()
  async create(
    @Param('companyGUID') companyGUID: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.userService.create(
      createUserDto,
      companyGUID,
      'ASMITH', //TODO : Grab from access token
      UserDirectory.BBCEID,
    );
  }

  /**
   * Retrieves the user corresponding to the company.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadUserDto} upon finding the right one.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Get(':userGUID')
  async find(
    @Param('companyGUID') companyGUID: string,
    @Param('userGUID') userGUID: string,
  ): Promise<ReadUserDto> {
    const companyUser = await this.userService.findOne(companyGUID, userGUID);
    if (!companyUser) {
      throw new DataNotFoundException();
    }
    return companyUser;
  }

  @ApiOkResponse({
    description: 'The User Resource List',
    type: ReadUserDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Param('companyGUID') companyGUID: string,
  ): Promise<ReadUserDto[]> {
    return await this.userService.findAll(companyGUID);
  }

  /**
   * Updates the user corresponding to the company.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadUserDto} upon successfully updating.
   */
  @ApiOkResponse({
    description: 'The User Resource',
    type: ReadUserDto,
  })
  @Put(':userGUID')
  async update(
    @Param('companyGUID') companyGUID: string,
    @Param('userGUID') userGUID: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.userService.update(
      companyGUID,
      userGUID,
      'ASMITH', //TODO : Grab from access token
      UserDirectory.BBCEID,
      updateUserDto,
    );
    if (!user) {
      throw new DataNotFoundException();
    }
    return user;
  }

  @ApiOkResponse({
    description: '{statusUpdated : true}',
  })
  @ApiParam({ name: 'statusCode', enum: UserStatus })
  @Put(':userGUID/status/:statusCode')
  async updateStatus(
    @Param('companyGUID') companyGUID: string,
    @Param('userGUID') userGUID: string,
    @Param('statusCode') statusCode: UserStatus,
  ): Promise<object> {
    const updateResult = await this.userService.updateStatus(
      companyGUID,
      userGUID,
      statusCode,
    );
    if (updateResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { statusUpdated: true };
  }
}
