import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfService } from './pdf.service';
import { Template } from './entities/template.entity';
import { PowerUnitTypesModule } from '../vehicles/power-unit-types/power-unit-types.module';
import { TrailerTypesModule } from '../vehicles/trailer-types/trailer-types.module';
import { CommonModule } from '../common/common.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    HttpModule,
    CommonModule,
    PowerUnitTypesModule,
    TrailerTypesModule,
    CacheModule,
  ],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
