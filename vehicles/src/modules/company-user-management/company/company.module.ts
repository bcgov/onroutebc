import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company.profile';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile],
  exports: [CompanyService],
})
export class CompanyModule {
  static forRoot(dataSource: DataSource, cacheManager: Cache): DynamicModule {
    return {
      module: CompanyModule,
      imports: [TypeOrmModule.forFeature([Company])],
      providers: [
        CompanyService,
        { provide: DataSource, useValue: dataSource },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        CompanyProfile,
      ],
      controllers: [CompanyController],
    };
  }
}
