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
    return await this.dmsService.create(file);
  }

  @Get(':documentId')
  async downloadFile(
    @Param('documentId') documentId: string,
  ): Promise<ReadFileDto> {
    return await this.dmsService.findOne(documentId);
  }
}
