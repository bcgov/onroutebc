import { Controller, Get } from '@nestjs/common';
import { TpsPermitService } from './tps-permit.service';

@Controller('tps-permit')
export class TpsPermitController {
  constructor(private readonly tpsPermitService: TpsPermitService) {}

  @Get()
  async getHello() {
    console.log('StartTime: ', new Date());
    const result = await this.tpsPermitService.uploadTpsPermit();
    console.log('EndTime: ', new Date());
    return result;
  }
}
