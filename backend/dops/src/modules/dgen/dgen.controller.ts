import { Controller, Post, Body, Req, Res } from '@nestjs/common';
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
import { Request, Response } from 'express';
import { ReadGeneratedDocumentDto } from './dto/response/read-generated-document.dto';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { CreateGeneratedDocumentDto } from './dto/request/create-generated-document.dto';
import { DgenService } from './dgen.service';
import { Public } from '../../decorator/public.decorator';
import { CdogsService } from '../common/cdogs.service';
import { DmsService } from '../dms/dms.service';

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
    private readonly cdogsService: CdogsService,
    private readonly dgenService: DgenService,
    private readonly dmsService: DmsService,
  ) {}

  @ApiCreatedResponse({
    description: 'The Generated Document Resource',
    type: ReadGeneratedDocumentDto,
  })
  @Public()
  @Post('/template/render')
  async generate(
    @Req() request: Request,
    @Res() res: Response,
    @Body() createGeneratedDocumentDto: CreateGeneratedDocumentDto,
  ) {
    const currentUser = request.user as IUserJWT;
    await this.dgenService.generate(
      currentUser,
      createGeneratedDocumentDto,
      res,
    );
    res.status(201);
  }
}
