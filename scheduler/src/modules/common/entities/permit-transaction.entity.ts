import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Permit } from './permit.entity';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'permit.ORBC_PERMIT_TRANSACTION' })
export class PermitTransaction extends Base {
  /**
   * A unique auto-generated ID for each permit transaction entity.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap(() => Permit)
  @ManyToOne(() => Permit, (permit) => permit.permitTransactions)
  @JoinColumn({ name: 'PERMIT_ID' })
  public permit: Permit;

  @AutoMap(() => Transaction)
  @ManyToOne(() => Transaction, (transaction) => transaction.permitTransactions)
  @JoinColumn({ name: 'TRANSACTION_ID' })
  public transaction: Transaction;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
    name: 'TRANSACTION_AMOUNT',
    nullable: false,
  })
  transactionAmount: number;
}
