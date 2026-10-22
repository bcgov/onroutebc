import { Controller, Get } from '@nestjs/common';
import { BpiService} from './bpi.service';

@Controller('bpi')
export class BpiController {
  constructor(private readonly bpiService: BpiService) {}

  @Get()
  async bpiFilesCronJob() {
    return await this.bpiService.bpiFilesCronJob();
  }
}
