import { Module } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../common/entities/transaction.entity';
import { Receipt } from '../common/entities/receipt.entity';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { GarmsFileTransaction } from './entities/garms-file-transaction.entity';
import { PermitType } from '../common/entities/permit-type.entity';
import { FileTransferController } from './garms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Receipt,
      GarmsExtractFile,
      GarmsFileTransaction,
      PermitType,
    ]),
  ],
  providers: [GarmsService],
  controllers: [FileTransferController]
})
export class GarmsModule {}
