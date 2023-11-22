import { DynamicModule, Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';

@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {
  static forRoot(httpService: HttpService, cacheManager: Cache): DynamicModule {
    return {
      module: EmailModule,

      providers: [
        EmailService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: HttpService, useValue: httpService },
      ],
      controllers: [EmailController],
    };
  }
}
