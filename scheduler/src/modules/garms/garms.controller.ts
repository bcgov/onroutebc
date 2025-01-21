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
}
