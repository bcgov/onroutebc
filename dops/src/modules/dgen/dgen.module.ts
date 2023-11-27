import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DgenService } from './dgen.service';
import { DocumentTemplate } from './entities/document-template.entity';
import { DgenController } from './dgen.controller';
import { DmsModule } from '../dms/dms.module';
import { ExternalDocument } from './entities/external-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTemplate, ExternalDocument]),
    DmsModule,
  ],
  controllers: [DgenController],
  providers: [DgenService],
  exports: [DgenService],
})
export class DgenModule {}
