import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';

@Module({
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
