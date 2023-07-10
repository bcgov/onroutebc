import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
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
  ApiOkResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorator/public.decorator';
import { CreatePermitDto } from './dto/request/create-permit.dto';
import { ReadPermitDto } from './dto/response/read-permit.dto';
import { Request, Response } from 'express';
import { AuthOnly } from 'src/common/decorator/auth-only.decorator';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { ReadFileDto } from '../common/dto/response/read-file.dto';

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
    return this.permitService.create(createPermitDto);
  }

  @ApiOkResponse({
    description: 'The Permit Resource',
    type: ReadPermitDto,
    isArray: true,
  })
  @Public()
  @Get()
  async get(
    @Query('permitNumber') permitNumber: string,
  ): Promise<ReadPermitDto[]> {
    return this.permitService.findByPermitNumber(permitNumber);
  }

  @AuthOnly()
  @ApiCreatedResponse({
    description: 'The DOPS file Resource with the presigned resource',
    type: ReadFileDto,
  })
  @ApiQuery({
    name: 'download',
    required: false,
    example: 'download=proxy',
    enum: FileDownloadModes,
    description:
      'Download mode behavior.' +
      'If proxy is specified, the object contents will be available proxied through DMS.' +
      'If url is specified, expect an HTTP 201 cotaining the presigned URL as a JSON string in the response.',
  })
  @Get('/pdf/:permitId')
  async getPDF(
    @Req() request: Request,
    @Param('permitId') permitId: string,
    @Query('download') download: FileDownloadModes,
    @Res() res: Response,
  ): Promise<void> {
    // TODO: Use IUserJWT / Exception handling
    const currentUser = request.user as IUserJWT;

    if (download === FileDownloadModes.PROXY) {
      await this.permitService.findPDFbyPermitId(
        currentUser,
        permitId,
        download,
        res,
      );
      res.status(200);
    } else {
      const file = await this.permitService.findPDFbyPermitId(
        currentUser,
        permitId,
        download,
      );
      if (download === FileDownloadModes.URL) {
        res.status(201).send(file);
      } else {
        res.status(302).set('Location', file.preSignedS3Url).end();
      }
    }
  }
}
