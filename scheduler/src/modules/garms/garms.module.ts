import { Module } from '@nestjs/common';
import { GarmsService } from './garms.service';
import { GarmsController } from './garms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../common/entities/transaction.entity';
import { Receipt } from '../common/entities/receipt.entity';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { GarmsFileTransaction } from './entities/garms-file-transaction.entity';
import { PermitType } from '../common/entities/permit-type.entity';

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
  controllers: [GarmsController],
  providers: [GarmsService],
})
export class GarmsModule {}
