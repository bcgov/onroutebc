import { Controller, Post, Body, Get, Req } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { CreatePendingIdirUserDto } from './dto/request/create-pending-idir-user.dto';
import { PendingIdirUsersService } from './pending-idir-users.service';
import { ReadPendingIdirUserDto } from './dto/response/read-pending-idir-user.dto';
import { getDirectory } from 'src/common/helper/auth.helper';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { Request } from 'express';

@ApiTags('User Management - Pending IDIR User')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Pending IDIR User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Pending IDIR User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Pending IDIR User Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('pending-idir-users')
export class PendingIdirUsersController {
  constructor(
    private readonly pendingIdirUserService: PendingIdirUsersService,
  ) {}

  /**
   * A POST method defined with the @Post() decorator and a route of
   * pending-idir-users that creates a new pending idir user
   * TODO: Secure endpoints once login is implemented.
   * @param createPendingIdirUserDto
   * @returns
   */
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPendingIdirUserDto: CreatePendingIdirUserDto,
  ): Promise<ReadPendingIdirUserDto> {
    const currentUser = request.user as IUserJWT;
    const directory = getDirectory(currentUser);
    const pendingIdirUser = await this.pendingIdirUserService.create(
      createPendingIdirUserDto,
      directory,
      currentUser,
    );
    return pendingIdirUser;
  }

  @Get()
  async findPendingIdirUser(): Promise<ReadPendingIdirUserDto[]> {
    const pendingIdirUser = await this.pendingIdirUserService.findAll();
    return pendingIdirUser;
  }
}
