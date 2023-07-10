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
  Req,
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
import { ExceptionDto } from '../../exception/exception.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/request/create-file.dto';
import { ReadFileDto } from './dto/response/read-file.dto';
import { FileDownloadModes } from '../../enum/file-download-modes.enum';
import { Request, Response } from 'express';
import { ComsService } from '../common/coms.service';
import { UpdateFileDto } from './dto/request/update-file.dto';
import { IUserJWT } from '../../interface/user-jwt.interface';

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
    @Req() request: Request,
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
    const currentUser = request.user as IUserJWT;
    file.filename = createFileDto.fileName
      ? createFileDto.fileName
      : file.originalname;

    const readCOMSDtoList = await this.comsService.createOrUpdateObject(
      currentUser,
      file,
    );

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
    @Req() request: Request,
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
    const currentUser = request.user as IUserJWT;
    file.filename = updateFileDto.fileName
      ? updateFileDto.fileName
      : file.originalname;

    const dmsObject = await this.dmsService.findLatest(documentId);
    if (dmsObject?.documentId !== documentId) {
      throw new BadRequestException('Invalid Document Id');
    }

    const readCOMSDto = await this.comsService.createOrUpdateObject(
      currentUser,
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
    @Req() request: Request,
    @Param('documentId') documentId: string,
    @Query('download') download: FileDownloadModes,
    @Res() res: Response,
  ) {
    const currentUser = request.user as IUserJWT;
    const file = await this.dmsService.findOne(documentId);

    if (download === FileDownloadModes.PROXY) {
      await this.comsService.getObject(
        currentUser,
        file,
        FileDownloadModes.PROXY,
        res,
      );
      res.status(200);
    } else {
      const url = (await this.comsService.getObject(
        currentUser,
        file,
        FileDownloadModes.URL,
      )) as string;
      file.preSignedS3Url = url;
      if (download === FileDownloadModes.URL) {
        res.status(201).send(file);
      } else {
        res.status(302).set('Location', file.preSignedS3Url).end();
      }
    }
  }
}
