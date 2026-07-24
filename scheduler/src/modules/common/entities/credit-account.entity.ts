import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Nullable } from '../../../common/types/common';
import { Transaction } from './transaction.entity';
import { Company } from './company.entity';

@Entity({ name: 'ORBC_CREDIT_ACCOUNT', schema: 'permit' })
export class CreditAccount {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the credit account metadata.',
  })
  @PrimaryGeneratedColumn({ name: 'CREDIT_ACCOUNT_ID' })
  creditAccountId: number;

  /**
   * The unique identifier of the company (Account Holder).
   */
  @AutoMap(() => Company)
  @OneToOne(() => Company, { nullable: false, cascade: false })
  @JoinColumn({ name: 'COMPANY_ID' })
  company: Company;

  @Column({
    name: 'CREDIT_ACCOUNT_STATUS_TYPE',
    type: 'nvarchar',
    length: 10,
    nullable: false,
  })
  creditAccountStatusType: string;

  @Column({
    name: 'CREDIT_ACCOUNT_TYPE',
    type: 'nvarchar',
    length: 10,
    nullable: false,
  })
  creditAccountType: string;

  @Column({ name: 'CFS_PARTY_NUMBER', type: 'int', nullable: true })
  cfsPartyNumber: number;

  @Column({
    name: 'CREDIT_ACCOUNT_NUMBER',
    type: 'nvarchar',
    length: 6,
    nullable: false,
  })
  creditAccountNumber: string;

  @Column({ name: 'CFS_SITE_NUMBER', type: 'int', nullable: true })
  cfsSiteNumber?: number;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description:
      'External adjustment dollar amount, currently will only be used for TPS migrations to store the unposted credit value',
  })
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
    name: 'EXTERNAL_ADJUSTMENT_AMT',
    nullable: true,
  })
  totalTransactionAmount?: number;

  @AutoMap()
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
    name: 'EXTERNAL_ADJUSTMENT_AMT',
    nullable: true,
    insert: false,
    update: false,
  })
  externalAdjustmentAmount: number;

  @AutoMap()
  @OneToMany(() => Transaction, (transaction) => transaction.creditAccount, {
    cascade: false,
    eager: false,
  })
  public transactions?: Nullable<Transaction[]>;
}
