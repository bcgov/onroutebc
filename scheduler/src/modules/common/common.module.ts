import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CreditAccount } from './entities/credit-account.entity';
import { Permit } from './entities/permit.entity';
import { Transaction } from './entities/transaction.entity';
import { PermitData } from './entities/permit-data.entity';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { PermitType } from './entities/permit-type.entity';
import { Receipt } from './entities/receipt.entity';
import { Document } from './entities/document.entity';
import { DocumentService } from './document.service';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Permit,
      PermitData,
      PermitTransaction,
      PermitType,
      Transaction,
      Receipt,
      Company,
      CreditAccount,
      Document,
    ]),
  ],
  providers: [CommonService, S3Service, DocumentService],
  exports: [
    HttpModule,
    CommonService,
    S3Service,
    DocumentService,
    TypeOrmModule,
  ],
})
export class CommonModule {}
