import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { Document } from './entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmsProfile } from './profiles/dms.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DmsController],
  providers: [DmsService, DmsProfile],
  exports: [DmsService],
})
export class DmsModule {}
