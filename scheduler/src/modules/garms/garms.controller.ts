import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GarmsService } from './garms.service';

@ApiTags('Health Check')
@Controller('garms')
export class GarmsController {
  constructor(private readonly garmsService: GarmsService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.garmsService.ftpsFile();
  }
  @Get('getHello2')
  getHello2() {
    this.garmsService.ftpsFile2();
  }
  @Get('getHello3')
  async getHello3() {
    console.log(await this.garmsService.ftpsFile3());
  }
}
