import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { Dms } from './entities/dms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmsProfile } from './profiles/dms.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Dms])],
  controllers: [DmsController],
  providers: [DmsService, DmsProfile],
  exports: [DmsService],
})
export class DmsModule {}
