import { Module } from '@nestjs/common';
import { GarmsController } from './garms.controller';
import { GarmsService } from './garms.service';

@Module({
  controllers: [GarmsController],
  providers: [GarmsService],
})
export class GarmsModule {}
