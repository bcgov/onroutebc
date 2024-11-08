import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from '../common/entities/permit.entity';
import { Transaction } from '../common/entities/transaction.entity';
import { Receipt } from './entities/receipt.entity';
import { PermitTransaction } from '../common/entities/permit-transaction.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Permit, PermitTransaction, Transaction, Receipt]),
  ],
  providers: [PermitService],
  exports: [HttpModule, PermitService],
})
export class PermitModule {}
