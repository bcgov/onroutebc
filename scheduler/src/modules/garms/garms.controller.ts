import { Controller, Get } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { GARMS_CASH_FILE_LOCATION, GARMS_CASH_FILE_LRECL } from 'src/common/constants/garms.constant';

@Controller('garms')
export class GarmsController {
  constructor(private readonly garmsService: GarmsService) {}
  @Get()
  async findAll() {
    await this.garmsService.upload('/tmp/test',GARMS_CASH_FILE_LRECL,process.env.GARMS_ENV + GARMS_CASH_FILE_LOCATION);
  }
}
