import { Controller, Get, Query } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { GarmsExtractType } from '../common/enum/garms-extract-type.enum';
import { ApiQuery } from '@nestjs/swagger';

@Controller('garms')
export class GarmsController {
  constructor(private readonly garmsService: GarmsService) {}
  @ApiQuery({
    name: 'garmsExtractType',
    enum: GarmsExtractType,
  })
  @Get()
  findAll(@Query('garmsExtractType') garmsExtractType: GarmsExtractType) {
    return this.garmsService.processCashTransactions(garmsExtractType);
  }
}
