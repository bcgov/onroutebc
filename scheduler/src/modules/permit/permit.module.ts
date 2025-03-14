import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from 'src/modules/common/entities/permit.entity';
import { PermitTransaction } from 'src/modules/common/entities/permit-transaction.entity';
import { Transaction } from 'src/modules/common/entities/transaction.entity';
import { Receipt } from '../common/entities/receipt.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Permit, PermitTransaction, Transaction, Receipt]),
  ],
  providers: [PermitService],
  exports: [HttpModule, PermitService],
})
export class PermitModule {}
