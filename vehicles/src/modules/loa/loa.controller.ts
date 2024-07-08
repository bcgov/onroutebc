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
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { UpdateLoaDto } from './dto/request/update-loa.dto';
import { GetLoaQueryParamsDto } from './dto/request/getLoa.query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DopsService } from '../common/dops.service';
import { CreateFileDto } from '../common/dto/request/create-file.dto';
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
  @Roles(Role.READ_PERMIT)
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
    if (file) {
      console.log('file exists')
      console.log('createLoaDto: ',createLoaDto);
      const createFileDto: CreateFileDto = new CreateFileDto();
      createFileDto.file = createLoaDto.file;
      createFileDto.fileName = createLoaDto.fileName;
      const readFileDto: ReadFileDto = await this.dopsService.upload(
        currentUser,
        createFileDto,
        companyId,
        file,
      );
      console.log('response from upload file: ', readFileDto);
    }
    const result = await this.loaService.create(
      currentUser,
      createLoaDto,
      companyId,
    );
    return result;
  }

  @ApiOperation({
    summary: 'Add LOA for a company.',
    description: 'Returns all LoAs for a company in database.',
  })
  @Roles(Role.READ_PERMIT)
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
  @Roles(Role.READ_PERMIT)
  @Get('/:loaId')
  async getById(
    @Param('companyId') companyId: number,
    @Param('loaId') loaId: string,
  ): Promise<ReadLoaDto> {
    const loa = await this.loaService.getById(companyId, loaId);
    return loa;
  }

  @ApiOperation({
    summary: 'Update LOA.',
    description: 'Updates and returns the Loa Object from database.',
  })
  @Roles(Role.READ_PERMIT)
  @Put('/:loaId')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('loaId') loaId: string,
    @Body() updateLoaDto: UpdateLoaDto,
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
    const loa = await this.loaService.update(
      currentUser,
      companyId,
      loaId,
      updateLoaDto,
    );
    return loa;
  }

  @ApiOperation({
    summary: 'Delete LOA by Id.',
    description: 'Returns the Loa Object in database.',
  })
  @Roles(Role.READ_PERMIT)
  @Delete('/:loaId')
  async delete(
    @Param('companyId') companyId: number,
    @Param('loaId') loaId: string,
  ): Promise<ReadLoaDto> {
    const loa = await this.loaService.delete(companyId, loaId);
    return loa;
  }
}
