import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf.service';
import { Template } from './entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), HttpModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
