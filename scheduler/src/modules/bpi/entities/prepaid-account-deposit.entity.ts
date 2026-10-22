import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '@modules/common/entities/base.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BPIFile } from './bpi-file.entity';

@Entity({ name: 'permit.ORBC_PREPAID_ACCOUNT_DEPOSIT' })
export class PrepaidAccountDeposit extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the prepaid account detail.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap()
  @ManyToOne(() => BPIFile, (BPIFile) => BPIFile.prepaidAccountDeposits, {
    eager: true,
    cascade: false,
  })
  @JoinColumn({ name: 'BPI_FILE_ID' })
  bpiFile: BPIFile;

  @AutoMap()
  @ApiProperty({
    example: 'WS0001',
    description: 'Represents the account number.',
  })
  @Column({
    length: 20,
    name: 'ACCOUNT_NUMBER',
    nullable: false,
  })
  accountNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the deposit amount.',
  })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    name: 'DEPOSIT_AMOUNT',
    nullable: false,
  })
  depositAmount: number;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13',
    description: 'Represents the effective payment date made by client.',
  })
  @Column({
    name: 'EFFECTIVE_PAYMENT_DATE',
    nullable: false,
  })
  effectivePaymentDate: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13',
    description: 'Represents the deposit date to ministry account.',
  })
  @Column({
    name: 'DEPOSIT_DATE',
    nullable: false,
  })
  depositDate: string;
}
