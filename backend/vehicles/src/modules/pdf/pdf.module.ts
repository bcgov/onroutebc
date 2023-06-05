import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf.service';
import { Template } from './entities/template.entity';
import { CommonModule } from '../common/common.module';
import { CompanyModule } from '../company-user-management/company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    HttpModule,
    CommonModule,
    CompanyModule,
  ],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
