import { Module } from '@nestjs/common';
import { GarmsService } from './garms.service';

@Module({
  providers: [GarmsService],
})
export class GarmsModule {}
