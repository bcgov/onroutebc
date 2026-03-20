import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { CdogsService } from './cdogs.service';
import { S3Service } from './s3.service';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CdogsService, S3Service, CommonService],
  exports: [HttpModule, CdogsService, S3Service],
})
export class CommonModule {}
