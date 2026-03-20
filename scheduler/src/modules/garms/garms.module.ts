import { Module } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../common/entities/transaction.entity';
import { Receipt } from '../common/entities/receipt.entity';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { GarmsFileTransaction } from './entities/garms-file-transaction.entity';
import { PermitType } from '../common/entities/permit-type.entity';
import { PermitData } from '../common/entities/permit-data.entity';
import { Company } from '../common/entities/company.entity';
import { CreditAccount } from '../common/entities/credit-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Receipt,
      GarmsExtractFile,
      GarmsFileTransaction,
      PermitType,
      PermitData,
      Company,
      CreditAccount,
    ]),
  ],
  providers: [GarmsService],
})
export class GarmsModule {}
