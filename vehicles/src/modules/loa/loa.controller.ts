import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { CreateLoaDto } from './dto/request/create-loa.dto';
import { ReadLoaDto } from './dto/response/read-loa.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { LoaService } from './loa.service';
import { Request } from 'express';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { GetLoaQueryParamsDto } from './dto/request/getLoa.query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DopsService } from '../common/dops.service';
import { ReadFileDto } from '../common/dto/response/read-file.dto';

@ApiBearerAuth()
@ApiTags('Company Letter of Authorization')
@Controller('companies/:companyId/loas')
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
  type: ExceptionDto,
})
export class LoaController {
  constructor(
    private readonly loaService: LoaService,
    private readonly dopsService: DopsService,
  ) {}
  @ApiOperation({
    summary: 'Add LOA for a company.',
    description:
      'An LOA is added to a company that allows special authorizations.' +
      'Returns the create Loa Object in database.',
  })
  @ApiCreatedResponse({
    description: 'The DMS file Resource',
    type: ReadLoaDto,
  })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: string,
    @Body() createLoaDto: CreateLoaDto,
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
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    let readFileDto: ReadFileDto = new ReadFileDto();
    if (file) {
      console.log('file exists');
      readFileDto = await this.dopsService.upload(currentUser, companyId, file);
      console.log('response from upload file: ', readFileDto);
    }
    console.log('body  is: ', createLoaDto);
    const demo = JSON.stringify(createLoaDto);
    console.log('body now is: ', demo);
    const result = await this.loaService.create(
      currentUser,
      createLoaDto,
      companyId,
      readFileDto.documentId,
    );
    return result;
  }

  @ApiOperation({
    summary: 'Add LOA for a company.',
    description: 'Returns all LoAs for a company in database.',
  })
  @Get()
  async get(
    @Param('companyId') companyId: number,
    @Query() getloaQueryParamsDto: GetLoaQueryParamsDto,
  ): Promise<ReadLoaDto[]> {
    const loa = await this.loaService.get(
      companyId,
      getloaQueryParamsDto.expired,
    );
    return loa;
  }

  @ApiOperation({
    summary: 'Add LOA by Id.',
    description: 'Returns the Loa Object in database.',
  })
  @Get('/:loaId')
  async getById(
    @Param('companyId') companyId: string,
    @Param('loaId') loaId: number,
  ): Promise<ReadLoaDto> {
    const loa = await this.loaService.getById(companyId, loaId);
    return loa;
  }

  @ApiOperation({
    summary: 'Update LOA.',
    description: 'Updates and returns the Loa Object from database.',
  })
  @ApiConsumes('multipart/form-data')
  @Put('/:loaId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: string,
    @Param('loaId') loaId: number,
    @Body() updateLoaDto: UpdateLoaDto,
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
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    const readFileDto: ReadFileDto = new ReadFileDto();
    if (file) {
      console.log('file exists');
      const readFileDto: ReadFileDto = await this.dopsService.upload(
        currentUser,
        companyId,
        file,
        updateLoaDto.documentId,
      );
      console.log('response from upload file: ', readFileDto);
    }
    const loa = await this.loaService.update(
      currentUser,
      companyId,
      loaId,
      updateLoaDto,
      readFileDto.documentId,
    );
    return loa;
  }

  @ApiOperation({
    summary: 'Delete LOA by Id.',
    description: 'Returns the Loa Object in database.',
  })
  @Delete('/:loaId')
  async delete(
    @Param('companyId') companyId: number,
    @Param('loaId') loaId: number,
  ): Promise<ReadLoaDto> {
    const loa = await this.loaService.delete(companyId, loaId);
    return loa;
  }
}
