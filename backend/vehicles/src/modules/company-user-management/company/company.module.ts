import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company.profile';
import { DataSource } from 'typeorm';
import { DatabaseHelper } from 'src/common/helper/database.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile, DatabaseHelper],
  exports: [CompanyService],
})
export class CompanyModule {
  static forRoot(dataSource: DataSource): DynamicModule {
    return {
      module: CompanyModule,
      imports: [TypeOrmModule.forFeature([Company])],
      providers: [
        CompanyService,
        { provide: DataSource, useValue: dataSource },
        CompanyProfile,
      ],
      controllers: [CompanyController],
    };
  }
}
