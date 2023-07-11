import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DgenService } from './dgen.service';
import { DocumentTemplate } from './entities/document-template.entity';
import { DgenController } from './dgen.controller';
import { DmsModule } from '../dms/dms.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTemplate]), DmsModule],
  controllers: [DgenController],
  providers: [DgenService],
  exports: [DgenService],
})
export class DgenModule {}
