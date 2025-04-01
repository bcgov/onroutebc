import { Module } from '@nestjs/common';
import { TpsPermitService } from './tps-permit.service';
import { TpsPermit } from './entities/tps-permit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './s3.service';
import { Permit } from 'src/modules/common/entities/permit.entity';
import { Document } from './entities/document.entity';
import { HttpModule } from '@nestjs/axios';
import { Company } from '../common/entities/company.entity';
import { CreditAccount } from '../common/entities/credit-account.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TpsPermit, Permit, Company, CreditAccount, Document]),
  ],
  providers: [TpsPermitService, S3Service],
  exports: [S3Service, HttpModule],
})
export class TpsPermitModule {}
