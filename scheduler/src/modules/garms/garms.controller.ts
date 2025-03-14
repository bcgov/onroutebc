import { Controller, Delete, Get } from '@nestjs/common';
import { GarmsService } from './garms.service';

@Controller('garms')
export class GarmsController {
  constructor(private readonly garmsService: GarmsService) {}
  @Get()
  async findAll() {
    await this.garmsService.processCashTransactions();
  }
  @Delete()
  DeleteOldFile() {
    this.garmsService.cleanOldFiles();
  }
}
