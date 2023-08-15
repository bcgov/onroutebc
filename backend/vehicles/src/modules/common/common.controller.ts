import {
  Controller,
  Post,
  Body,
  Req,
} from '@nestjs/common';

import { CommonService } from './common.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiMethodNotAllowedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { ReadErrorDto } from './dto/response/read-error.dto';
import { AuthOnly } from 'src/common/decorator/auth-only.decorator';
import { CreateErrorDto } from './dto/request/create-error.dto';
import { Request } from 'express';
import { ExceptionDto } from 'src/common/exception/exception.dto';


@ApiTags('Common')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Common Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Common Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Common Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('errors')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

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
    description: 'The errors Resource',
    type: ReadErrorDto,
  })
  @AuthOnly()
  @Post()
  async create(
    @Req() request: Request,
    @Body() createErrorDto: CreateErrorDto,
  ) {
    return await this.commonService.createOrbcError(
      createErrorDto
    );
  }

}
