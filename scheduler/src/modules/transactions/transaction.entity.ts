import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { TransactionDetail } from './transaction-detail.entity';

@Entity('ORBC_TRANSACTION', { schema: 'permit' })
export class Transaction {
  @PrimaryGeneratedColumn()
  TRANSACTION_ID: number;

  @Column()
  TOTAL_TRANSACTION_AMOUNT: number;

  @Column()
  TRANSACTION_TYPE: string;

  @OneToOne(() => TransactionDetail, detail => detail.transaction)
  @JoinColumn({ name: 'TRANSACTION_ID' })
  detail: TransactionDetail;
  
}
