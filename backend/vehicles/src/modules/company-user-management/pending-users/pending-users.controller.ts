import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

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
import { CreatePendingUserDto } from './dto/request/create-pending-user.dto';
import { UpdatePendingUserDto } from './dto/request/update-pending-user.dto';
import { ReadPendingUserDto } from './dto/response/read-pending-user.dto';
import { PendingUsersService } from './pending-users.service';

@ApiTags('Company and User Management - Pending User')
@ApiNotFoundResponse({
  description: 'The Pending User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Pending User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Pending User Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('company/:companyGUID/pending-user')
export class PendingUsersController {
  constructor(private readonly pendingUserService: PendingUsersService) {}

  /**
   * A POST method defined with the @Post() decorator and a route of
   * company/:companyGUID/pending-user that creates a new pending user
   * associated with the company.
   * TODO: Validations on {@link CreatePendingUserDto}.
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyGUID The company GUID.
   * @param createPendingUserDto The http request object containing the pending user
   * details.
   *
   * @returns The details of the pending user with response object
   * {@link ReadCompanyUserDto}
   */
  @ApiCreatedResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Post()
  async create(
    @Param('companyGUID') companyGUID: string,
    @Body() createUserDto: CreatePendingUserDto,
  ) {
    return await this.pendingUserService.create(companyGUID, createUserDto);
  }

  /**
   * A GET method defined with the @Get() decorator and a route of
   * company/:companyGUID/pending-user that retrieves a list of pending users
   * associated with the company
   *
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyGUID The company GUID.
   *
   * @returns The list of pending users with response object as an array of
   * {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource List',
    type: ReadPendingUserDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Param('companyGUID') companyGUID: string,
  ): Promise<ReadPendingUserDto[]> {
    return await this.pendingUserService.findAll(companyGUID);
  }

  /**
   * A GET method defined with the @Get(:userName) decorator and a route of
   * company/:companyGUID/pending-user/:userName that retrieves the pending user
   * associated with the company by user name
   *
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyGUID The company GUID.
   * @param userName The userName of the pending user.
   *
   * @returns The pending user with response object {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Get(':userName')
  async find(
    @Param('companyGUID') companyGUID: string,
    @Param('userName') userName: string,
  ): Promise<ReadPendingUserDto> {
    const pendingUser = await this.pendingUserService.findOne(
      companyGUID,
      userName,
    );
    if (!pendingUser) {
      throw new DataNotFoundException();
    }
    return pendingUser;
  }

  /**
   * A PUT method defined with the @Put(':userName') decorator and a route of
   * company/:companyGUID/pending-user/:userName that updates a pending user by
   * user name.
   * TODO: Validations on {@link UpdateCompanyDto}.
   * TODO: Validations on {@link UpdateCompanyDto}.
   * TODO: Secure endpoints once login is implemented.
   *
   * @param companyGUID The company GUID.
   * @param userName The user name of the pending user.
   * @param updatePendingUserDto The http request object of type {@link UpdatePendingUserDto}
   * containing the pending user details.
   *
   * @returns The pending user with response object {@link ReadPendingUserDto}.
   */
  @ApiOkResponse({
    description: 'The Pending User Resource',
    type: ReadPendingUserDto,
  })
  @Put(':userName')
  async update(
    @Param('companyGUID') companyGUID: string,
    @Param('userName') userName: string,
    @Body() updatePendingUserDto: UpdatePendingUserDto,
  ): Promise<ReadPendingUserDto> {
    const pendingUser = await this.pendingUserService.update(
      companyGUID,
      userName,
      updatePendingUserDto,
    );
    if (!pendingUser) {
      throw new DataNotFoundException();
    }
    return pendingUser;
  }

  /**
   * A DELETE method defined with the @Delete(':userName') decorator and a route of
   * company/:companyGUID/pending-user/:userName that deletes a pending user by
   * user name.
   * @param companyGUID The company GUID.
   * @param userName The user name of the pending user.
   * @returns true upon successful deletion.
   */
  @Delete(':userName')
  async remove(
    @Param('companyGUID') companyGUID: string,
    @Param('userName') userName: string,
  ) {
    const deleteResult = await this.pendingUserService.remove(
      companyGUID,
      userName,
    );
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }
}
