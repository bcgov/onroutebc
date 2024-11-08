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
  transactionId: number;

  @Column({
    name: 'CFS_FILE_STATUS_TYPE',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  cfsFileStatus: string;

  @Column({ name: 'PROCESSSING_DATE_TIME', type: 'timestamp', nullable: false })
  processingDateTime: Date;

  @Column({ name: 'DB_CREATE_TIMESTAMP', type: 'timestamp', nullable: false })
  createdDateTime: Date;

  @Column({
    name: 'DB_LAST_UPDATE_TIMESTAMP',
    type: 'timestamp',
    nullable: false,
  })
  updatedDateTime: Date;

  @Column({ name: 'FILE_NAME', type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({
    type: 'char',
    name: 'REPROCESS_FLAG',
    default: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  reprocessFlag: boolean;

  @OneToOne(() => Transaction, (transaction) => transaction.transactionId, {
    cascade: false,
  })
  @JoinColumn({ name: 'TRANSACTION_ID' })
  transaction: Transaction;
}
