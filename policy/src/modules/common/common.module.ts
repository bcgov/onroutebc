import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CommonService],
  exports: [HttpModule],
})
export class CommonModule {}
