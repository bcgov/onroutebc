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
  ApiOkResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/request/create-file.dto';
import { ReadFileDto } from './dto/response/read-file.dto';

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
  constructor(private readonly dmsService: DmsService) {}

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
    file: ArrayBuffer,
  ): Promise<ReadFileDto> {
    return await this.dmsService.create(file);
  }

  @ApiOkResponse({
    description: 'The DMS file Resource',
    type: ReadFileDto,
  })
  @Get(':documentId')
  async downloadFile(
    @Param('documentId') documentId: string,
  ): Promise<ReadFileDto> {
    return await this.dmsService.findOne(documentId);
  }
}
