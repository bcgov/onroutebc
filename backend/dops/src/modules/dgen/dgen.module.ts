import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DgenService } from './dgen.service';
import { Template } from './entities/template.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Template]),HttpModule],
  providers: [DgenService],
  exports: [DgenService],
})
export class DgenModule {}
