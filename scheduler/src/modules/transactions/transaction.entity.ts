import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ORBC_TRANSACTION', { schema: 'permit' })
export class Transaction {
  @PrimaryGeneratedColumn()
  TRANSACTION_ID: number;

  @Column()
  TOTAL_TRANSACTION_AMOUNT: number;

  @Column()
  TRANSACTION_TYPE: string;
  
}
