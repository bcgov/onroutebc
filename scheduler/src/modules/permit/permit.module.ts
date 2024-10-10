import { Module } from '@nestjs/common';
import { PermitService } from './permit.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permit } from './entities/permit.entity';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { Transaction } from './entities/transaction.entity';
import { Receipt } from './entities/receipt.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Permit, PermitTransaction, Transaction, Receipt]),
  ],
  providers: [PermitService],
  exports: [HttpModule, PermitService],
})
export class PermitModule {}
