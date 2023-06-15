import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf.service';
import { Template } from './entities/template.entity';
import { CompanyModule } from '../company-user-management/company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), CompanyModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
