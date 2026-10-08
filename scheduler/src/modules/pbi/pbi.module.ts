import { Module } from '@nestjs/common';
import { PbiService } from './pbi.service';
import { PbiController } from './pbi.controller';

@Module({
  controllers: [PbiController],
  providers: [PbiService],
})
export class PbiModule {}
