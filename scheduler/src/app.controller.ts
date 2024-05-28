import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { getAccessToken } from './common/helper/gov-common-services.helper';
import { GovCommonServices } from './common/enum/gov-common-services.enum';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @ApiTags('Health Check')
  @Get()
  getHealthCheck(): string {
    const result = getAccessToken(
      GovCommonServices.ORBC_SERVICE_ACCOUNT,
      this.httpService,
      this.cacheManager,
    );
    console.log(result);
    return this.appService.getHealthCheck();
  }
}
