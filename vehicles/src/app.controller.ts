import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorator/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
  console.log('process.env.VEHICLES_API_TYPEORM_LOG_LEVEL',process.env.VEHICLES_API_TYPEORM_LOG_LEVEL);
    return this.appService.getHello();
  }
}
