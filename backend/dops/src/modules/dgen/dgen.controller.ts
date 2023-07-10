import {
  Controller,
  Post,
  Body,
  Req,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
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
import { Request, Response } from 'express';
import { ReadGeneratedDocumentDto } from './dto/response/read-generated-document.dto';
import { IUserJWT } from '../../interface/user-jwt.interface';
import { CreateGeneratedDocumentDto } from './dto/request/create-generated-document.dto';
import { DgenService } from './dgen.service';
import { Public } from '../../decorator/public.decorator';
import { CdogsService } from '../common/cdogs.service';
import { DmsService } from '../dms/dms.service';
import { Readable } from 'stream';

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
    private readonly dmsService: DmsService,
  ) {}

  @ApiCreatedResponse({
    description: 'The Generated Document Resource',
    type: ReadGeneratedDocumentDto,
  })
  @Public()
  @Post('/render')
  async generate(
    @Req() request: Request,
    @Res() res: Response,
    @Body() createGeneratedDocumentDto: CreateGeneratedDocumentDto,
  ) {
    const currentUser = request.user as IUserJWT;
    const generatedDocument = await this.cdogsService.generateDocument(
      currentUser,
      createGeneratedDocumentDto,
    );
    const comsData = await this.comsService.createOrUpdateObject(
      currentUser,
      generatedDocument,
    );
    if (!comsData?.length) {
      throw new InternalServerErrorException();
    }
    const dmsObject = await this.dmsService.create(comsData);
    res.setHeader('orbc-dms-id', dmsObject.documentId);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${generatedDocument.originalname}`,
    );
    res.setHeader('Content-Length', generatedDocument.size);
    res.setHeader('Content-Type', generatedDocument.mimetype);
    const stream = new Readable();
    stream.push(generatedDocument.buffer);
    stream.push(null); // indicates end-of-file basically - the end of the stream
    stream.pipe(res).status(201);
  }
}
