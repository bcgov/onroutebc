import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from '@modules/common/entities/permit.entity';
import { PermitTransaction } from '@modules/common/entities/permit-transaction.entity';
import { Transaction } from '@modules/common/entities/transaction.entity';
import { Receipt } from '@modules/common/entities/receipt.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Permit, PermitTransaction, Transaction, Receipt]),
  ],
  providers: [PermitService],
  exports: [HttpModule, PermitService],
})
export class PermitModule {}
