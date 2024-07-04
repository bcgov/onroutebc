import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  constructor(private readonly loaService: LoaService) {}
  @ApiOperation({
    summary: 'Add LOA for a company.',
    description:
      'An LOA is added to a company that allows special authorizations.' +
      'Returns the create Loa Object in database.',
  })
  @Roles(Role.READ_PERMIT)
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createLoaDto: CreateLoaDto,
  ): Promise<ReadLoaDto> {
    const currentUser = request.user as IUserJWT;
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
    const loa = await this.loaService.get(companyId, getloaQueryParamsDto.expired);
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
}
