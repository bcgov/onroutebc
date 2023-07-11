import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ComsService } from './coms.service';
import { CdogsService } from './cdogs.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [ComsService, CdogsService],
  exports: [HttpModule, ComsService, CdogsService],
})
export class CommonModule {}
