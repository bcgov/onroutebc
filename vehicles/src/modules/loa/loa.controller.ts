import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { LoaService } from './loa.service';
import { Request, Response } from 'express';
import { GetLoaQueryParamsDto } from './dto/request/queryParam/get-loa.query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDownloadModes } from 'src/common/enum/file-download-modes.enum';
import { setResHeaderCorrelationId } from 'src/common/helper/response-header.helper';
import { JsonReqBodyInterceptor } from '../../common/interceptor/json-req-body.interceptor';
import { CreateLoaFileDto } from './dto/request/create-loa-file.dto';
import { CompanyIdPathParamDto } from '../common/dto/request/pathParam/companyId.path-param.dto';
import { UpdateLoaFileDto } from './dto/request/update-loa-file.dto';
import { LoaIdPathParamDto } from './dto/request/pathParam/loa-Id.path-params.dto';
import { GetDocumentQueryParamsDto } from '../common/dto/request/queryParam/getDocument.query-params.dto';
import { IsFeatureFlagEnabled } from '../../common/decorator/is-feature-flag-enabled.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';

@ApiBearerAuth()
@ApiTags('Letter of Authorization (LoA)')
@IsFeatureFlagEnabled('LOA')
@Controller('companies/:companyId/loas')
@ApiMethodNotAllowedResponse({
  description: 'The LoA Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The LoA Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The LoA Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
export class LoaController {
  constructor(private readonly loaService: LoaService) {}

  @ApiOperation({
    summary: 'Add LoA for a company.',
    description:
      'Add an LOA to a company, allowing special authorizations. Returns the created LoA object from the database.',
  })
  @ApiCreatedResponse({
    description: 'The DMS file Resource',
    type: ReadLoaDto,
  })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.WRITE_LOA)
  @Post()
  @UseInterceptors(FileInterceptor('file'), JsonReqBodyInterceptor)
  async create(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createLoaFileDto: CreateLoaFileDto,
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    const result = await this.loaService.create(
      currentUser,
      createLoaFileDto?.body,
      companyId,
      file,
    );
    return result;
  }

  @ApiOperation({
    summary: 'Get all LoA for a company.',
    description: 'Returns all LOAs for a company in the database.',
  })
  @Get()
  async get(
    @Param() { companyId }: CompanyIdPathParamDto,
    @Query() getloaQueryParamsDto: GetLoaQueryParamsDto,
  ): Promise<ReadLoaDto[]> {
    const loa = await this.loaService.get(
      companyId,
      getloaQueryParamsDto.expired,
    );
    return loa;
  }

  @ApiOperation({
    summary: 'Get LoA by Id.',
    description: 'Returns the LoA object from the database.',
  })
  @Roles(Role.READ_LOA)
  @Get('/:loaId')
  async getById(
    @Req() request: Request,
    @Param() { companyId, loaId }: LoaIdPathParamDto,
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.getById(currentUser, companyId, loaId);
    return loa;
  }

  @ApiOperation({
    summary: 'Update LoA.',
    description: 'Updates and returns the LoA object from the database.',
  })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.WRITE_LOA)
  @Put('/:loaId')
  @UseInterceptors(FileInterceptor('file'), JsonReqBodyInterceptor)
  async update(
    @Req() request: Request,
    @Param() { companyId, loaId }: LoaIdPathParamDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() updateLoaFileDto: UpdateLoaFileDto,
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.updateLoa(
      currentUser,
      companyId,
      loaId,
      updateLoaFileDto?.body,
      file,
    );
    return loa;
  }

  @ApiOperation({
    summary: 'Delete LoA by Id.',
    description: 'Deletes the LoA object from the database.',
  })
  @Roles(Role.WRITE_LOA)
  @Delete('/:loaId')
  async delete(
    @Req() request: Request,
    @Param() { companyId, loaId }: LoaIdPathParamDto,
  ): Promise<string> {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.delete(currentUser, loaId, companyId);
    return loa;
  }

  @ApiOperation({
    summary: 'Get LoA Document',
    description: 'Retrieve the LoA document from the database.',
  })
  @Roles(Role.READ_LOA)
  @Get('/:loaId/documents')
  async getLoaDocument(
    @Req() request: Request,
    @Param() { companyId, loaId }: LoaIdPathParamDto,
    @Query() { download }: GetDocumentQueryParamsDto,
    @Res() res: Response,
  ) {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.getLoaDocument(
      currentUser,
      companyId,
      loaId,
      download,
      res,
    );
    if (download === FileDownloadModes.URL) {
      setResHeaderCorrelationId(res);
      res.status(201).send(loa);
    }
  }

  @ApiOperation({
    summary: 'Delete LoA Document',
    description: 'Deletes the LoA document from the database.',
  })
  @Roles(Role.WRITE_LOA)
  @Delete('/:loaId/documents')
  async deleteLoaDocument(
    @Req() request: Request,
    @Param() { companyId, loaId }: LoaIdPathParamDto,
  ): Promise<string> {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.deleteLoaDocument(
      currentUser,
      companyId,
      loaId,
    );
    return loa;
  }
}
