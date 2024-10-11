import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('ORBC_CFS_TRANSACTION_DETAIL', { schema: 'permit' })
export class CfsTransactionDetail {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'TRANSACTION_ID', type: 'int', nullable: false })
  TRANSACTION_ID: number;

  @Column({
    name: 'CFS_FILE_STATUS_TYPE',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  CFS_FILE_STATUS_TYPE: string;

  @Column({ name: 'PROCESSSING_DATE_TIME', type: 'timestamp', nullable: false })
  PROCESSSING_DATE_TIME: Date;

  @Column({ name: 'FILE_NAME', type: 'varchar', length: 255, nullable: false })
  FILE_NAME: string;

  @OneToOne(() => Transaction, (transaction) => transaction.transactionId, {
    cascade: false,
  })
  @JoinColumn({ name: 'TRANSACTION_ID' })
  transaction: Transaction;
}
