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
   * Creates a pending user.
   * @param createPendingUserDto The http request object containing the user details.
   * @returns 201
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

  @ApiOkResponse({
    description: 'The Pending User Resource List',
    type: ReadPendingUserDto,
    isArray: true,
  })
  @Get('')
  async findAll(
    @Param('companyGUID') companyGUID: string,
  ): Promise<ReadPendingUserDto[]> {
    return await this.pendingUserService.findAll(companyGUID);
  }

  /**
   * Retrieves the user corresponding to the company.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadPendingUserDto} upon finding the right one.
   */
  @ApiOkResponse({
    description: 'The User Resource',
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
   * Updates the user corresponding to the company.
   * @param companyGUID A temporary placeholder parameter to get the company by Id.
   *        Will be removed once login system is implemented.
   * @param userGUID A temporary placeholder parameter to get the user by Id.
   *        Will be removed once login system is implemented.
   * @returns {@link ReadPendingUserDto} upon successfully updating.
   */
  @ApiOkResponse({
    description: 'The User Resource',
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
