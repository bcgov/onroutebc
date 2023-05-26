import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { Dms } from './entities/dms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ComsService } from './coms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dms]), HttpModule],
  controllers: [DmsController],
  providers: [DmsService, ComsService],
})
export class DmsModule {}
