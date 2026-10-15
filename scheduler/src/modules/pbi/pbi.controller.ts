import { Controller, Get } from '@nestjs/common';
import { PbiService } from './pbi.service';

@Controller('pbi')
export class PbiController {
  constructor(private readonly pbiService: PbiService) {}

  @Get()
  async findAll() {
    return await this.pbiService.findAll();
  }
}
