import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';

@Entity('ORBC_TRANSACTION', { schema: 'permit' })
export class Transaction {
  @PrimaryGeneratedColumn()
  TRANSACTION_ID: number;

  @Column()
  TOTAL_TRANSACTION_AMOUNT: number;

  @Column()
  TRANSACTION_TYPE: string;

  @OneToOne(() => ORBC_CFSTransactionDetail, detail => detail.transaction)
  @JoinColumn({ name: 'TRANSACTION_ID' })
  detail: ORBC_CFSTransactionDetail;
  
}
