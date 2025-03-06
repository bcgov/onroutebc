import { Module } from '@nestjs/common';
import { TpsPermitService } from './tps-permit.service';
import { TpsPermit } from './entities/tps-permit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './s3.service';
import { Permit } from 'src/modules/common/entities/permit.entity';
import { Document } from './entities/document.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TpsPermit, Permit, Document]),
  ],
  providers: [TpsPermitService, S3Service],
  exports: [S3Service, HttpModule],
})
export class TpsPermitModule {}
