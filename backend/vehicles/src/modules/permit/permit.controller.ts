import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermitService } from './permit.service';
import { ExceptionDto } from '../common/dto/exception.dto';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorator/public.decorator';
import { CreatePermitDto } from './dto/request/create-permit.dto';

@ApiTags('Permit')
@ApiNotFoundResponse({
  description: 'The User Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The User Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The User Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('permit')
export class PermitController {
  constructor(private readonly permitService: PermitService) {}

  @Public()
  @Post()
  async create(@Body() createPermitDto: CreatePermitDto) {
    return await this.permitService.create(createPermitDto);
  }

  @Get()
  findAll() {
    return this.permitService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permitService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermitDto: CreatePermitDto) {
    return this.permitService.update(+id, updatePermitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permitService.remove(+id);
  }
}
