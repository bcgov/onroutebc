import { Controller, Post, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../exception/exception.dto';
import { ComsService } from '../common/coms.service';
import { AuthOnly } from '../../decorator/auth-only.decorator';
import { Request } from 'express';
import { ReadGeneratedDocumentDto } from './dto/response/read-generated-document.dto';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { CreateGeneratedDocumentDto } from './dto/request/create-generated-document.dto';
import { DgenService } from './dgen.service';
import { Public } from '../../decorator/public.decorator';
import { CdogsService } from '../common/cdogs.service';

@ApiTags('Document Generator (DGEN)')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The DGEN Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The DGEN Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The DGEN Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('dgen')
export class DgenController {
  constructor(
    private readonly comsService: ComsService,
    private readonly cdogsService: CdogsService,
    private readonly dgenService: DgenService,
  ) {}

  @ApiCreatedResponse({
    description: 'The Generated Document Resource',
    type: ReadGeneratedDocumentDto,
  })
  @Public()
  @Post('/render')
  async generate(
    @Req() request: Request,
    @Body() createGeneratedDocumentDto: CreateGeneratedDocumentDto,
  ): Promise<ReadGeneratedDocumentDto> {
    const currentUser = request.user as IUserJWT;
    const generatedDocument = await this.cdogsService.generateDocument(currentUser, createGeneratedDocumentDto);
    this.comsService
    return null;
  }
}
