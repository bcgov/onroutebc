import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  Query,
  Res,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { DmsService } from './dms.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/request/create-file.dto';
import { ReadFileDto } from './dto/response/read-file.dto';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { Response } from 'express';
import { ComsService } from './coms.service';
import { UpdateFileDto } from './dto/request/update-file.dto';

@ApiTags('DMS')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The DMS Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The DMS Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The DMS Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('dms')
export class DmsController {
  constructor(
    private readonly dmsService: DmsService,
    private readonly comsService: ComsService,
  ) {}

  @ApiCreatedResponse({
    description: 'The DMS file Resource',
    type: ReadFileDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }),
          /**
           * TODO explore custom validator to verify files magic number rather
           * than extention in the filename. Also, accept multiple file types */
          //new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ReadFileDto> {
    file.filename = createFileDto.fileName
      ? createFileDto.fileName
      : file.originalname;

    const readCOMSDtoList = await this.comsService.createObject(file);

    if (!readCOMSDtoList?.length) {
      throw new InternalServerErrorException();
    }

    return await this.dmsService.create(readCOMSDtoList);
  }

  @ApiCreatedResponse({
    description: 'The DMS file Resource',
    type: ReadFileDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload/:documentId')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Body() updateFileDto: UpdateFileDto,
    @Param('documentId') documentId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }),
          /**
           * TODO explore custom validator to verify files magic number rather
           * than extention in the filename. Also, accept multiple file types */
          //new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ReadFileDto> {
    file.filename = updateFileDto.fileName
      ? updateFileDto.fileName
      : file.originalname;

    const dmsObject = await this.dmsService.findLatest(documentId);
    if (dmsObject?.documentId !== documentId) {
      throw new BadRequestException('Invalid Document Id');
    }

    const readCOMSDto = await this.comsService.createObject(
      file,
      dmsObject.s3ObjectId,
    );

    if (!readCOMSDto?.length) {
      throw new InternalServerErrorException();
    }

    return await this.dmsService.create(readCOMSDto, dmsObject);
  }

  @ApiCreatedResponse({
    description: 'The DMS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @ApiQuery({
    name: 'download',
    required: false,
    example: 'download=proxy',
    enum: FileDownloadModes,
    description:
      'Download mode behavior.' +
      'Default behavior (undefined) will yield an HTTP 302 redirect to the S3 bucket via presigned URL.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
  })
  @Get(':documentId')
  async downloadFile(
    @Param('documentId') documentId: string,
    @Query('download') download: FileDownloadModes,
    @Res() res: Response,
  ) {
    const file = await this.dmsService.findOne(documentId);

    if (download === FileDownloadModes.PROXY) {     
      // const fileObject = await this.comsService.getObject(
      //   file,
      //   FileDownloadModes.PROXY,
      //   res,
      // );
      //res.status(200).send(fileObject);

      // TODO: Start Temp solution - discuss with praveen
      const url = await this.comsService.getObject(file, FileDownloadModes.URL);
      file.preSignedS3Url = url;
      res.status(302).set('Location', file.preSignedS3Url).end();
      // TODO: End Temp solution
    } else {
      const url = await this.comsService.getObject(file, FileDownloadModes.URL);
      file.preSignedS3Url = url;
      if (download === FileDownloadModes.URL) {
        res.status(201).send(file);
      } else {
        res.status(302).set('Location', file.preSignedS3Url).end();
      }
    }
  }
}
