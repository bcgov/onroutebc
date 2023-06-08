import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company.profile';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile],
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
