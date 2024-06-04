import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PermitService],
  exports: [HttpModule],
})
export class PermitModule {}
