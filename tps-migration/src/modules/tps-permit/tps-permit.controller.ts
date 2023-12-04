import { Controller, Get } from '@nestjs/common';
import { TpsPermitService } from './tps-permit.service';

@Controller('tps-permit')
export class TpsPermitController {
  constructor(private readonly tpsPermitService: TpsPermitService) {}

  @Get()
  async getHello() {
    const result = await this.tpsPermitService.uploadTpsPermit();
    return result;
  }
}
