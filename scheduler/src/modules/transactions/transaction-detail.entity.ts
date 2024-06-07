import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('ORBC_CFS_TRANSACTION_DETAIL', { schema: 'permit' })
export class ORBC_CFSTransactionDetail {
  @PrimaryGeneratedColumn()
    id: number;

    @Column()
    TRANSACTION_ID: number;

    @Column()
    CFS_FILE_STATUS_TYPE: string;

    @Column()
    PROCESSSING_DATE_TIME: string;

    @Column()
    FILE_NAME: string;

    @OneToOne(() => Transaction, transaction => transaction.detail)
    @JoinColumn({ name: 'TRANSACTION_ID' })
    transaction: Transaction;
  
}
