import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  HttpException,
  Query,
  Res,
} from '@nestjs/common';
import { PermitService } from './permit.service';
import { ExceptionDto } from '../../common/exception/exception.dto';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from '../../common/decorator/public.decorator';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Request, Response } from 'express';
import { AuthOnly } from 'src/common/decorator/auth-only.decorator';
import { ReadPdfDto } from './dto/response/read-pdf.dto';
import { DownloadMode } from 'src/common/enum/pdf.enum';

@ApiBearerAuth()
@ApiTags('Permit')
@ApiNotFoundResponse({
  description: 'The Permit Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Permit Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Permit Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('permit')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @ApiCreatedResponse({
    description: 'The Permit Resource',
    type: ReadPermitDto,
  })
  @Public()
  @Post()
  async create(
    @Req() request: Request,
    @Body() createPermitDto: CreatePermitDto,
  ): Promise<ReadPermitDto> {
    return await this.permitService.create(createPermitDto);
  }

  @AuthOnly()
  @Get('/pdf/:permitId')
  @ApiQuery({
    name: 'download',
    required: false,
    example: 'download=proxy',
    enum: DownloadMode,
    description:
      'Download mode behavior.' +
      'Default behavior (undefined) will yield an HTTP 302 redirect to the S3 bucket via presigned URL.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
  })
  async getPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Query('download') download: DownloadMode,
    @Res() response: Response,
  ): Promise<void> {
    // TODO: Use IUserJWT / Exception handling
    const access_token = request.headers.authorization;
    if (!access_token) throw new HttpException('Unauthorized', 401);

    const document = await this.permitService.findPDFbyPermitId(
      access_token,
      permitId,
      download,
    );

    // TODO: Fix error on DMS microservice for handling redirect option
    if (download === DownloadMode.PROXY) {
      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${document.fileName}.pdf`,
      });
      response.send(document.file);
      return;
    }

    const readPdfDto: ReadPdfDto = {
      documentId: document.documentId,
      document: document.preSignedS3Url,
    };
    response.set({
      'Content-Type': 'application/json',
    });
    response.send(readPdfDto);
  }
}
