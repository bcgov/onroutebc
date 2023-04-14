import { Controller, Post, Body, Req } from '@nestjs/common';
import { PermitService } from './permit.service';
import { ExceptionDto } from '../common/dto/exception.dto';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorator/public.decorator';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Request } from 'express';

@ApiTags('Permit')
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
@Controller('permit')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @Public()
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPermitDto: CreatePermitDto,
  ): Promise<ReadPermitDto> {
    return await this.permitService.create(createPermitDto);
  }
}
