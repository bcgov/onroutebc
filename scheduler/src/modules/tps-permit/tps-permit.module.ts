import { Module } from '@nestjs/common';
import { TpsPermitService } from './tps-permit.service';
import { TpsPermit } from './entities/tps-permit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '@modules/common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([TpsPermit])],
  providers: [TpsPermitService, S3Service],
  exports: [S3Service],
})
export class TpsPermitModule {}
