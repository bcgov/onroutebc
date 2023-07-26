import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Receipt } from './receipt.entity';

@Entity({ name: 'permit.ORBC_TRANSACTION' })
export class Transaction extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the transaction metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'TRANSACTION_ID' })
  transactionId: string;

  @AutoMap()
  @ApiProperty({
    example: 'P',
    description:
      'Represents the original value sent to indicate the type of transaction to perform (i.e. P, R, VP, VR, PA, PAC, Q).',
  })
  @Column({
    length: '3',
    name: 'TRANSACTION_TYPE',
    nullable: false,
  })
  transactionType: string;

  // TODO: Max length is 10?
  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  @Column({
    length: '30',
    name: 'TRANSACTION_ORDER_NUMBER',
    nullable: false,
  })
  transactionOrderNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '10000148',
    description:
      'Bambora-assigned eight-digit unique id number used to identify an individual transaction.',
  })
  @Column({ type: 'bigint', name: 'PROVIDER_TRANSACTION_ID' })
  providerTransactionId: number;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  @Column({
    name: 'TRANSACTION_AMOUNT',
    nullable: false,
  })
  transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  @Column({ type: 'int', name: 'TRANSACTION_APPROVED', nullable: false })
  approved: number;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description:
      'Represents the auth code of a transaction. If the transaction is approved this parameter will contain a unique bank-issued code.',
  })
  @Column({
    length: '32',
    name: 'AUTH_CODE',
    nullable: false,
  })
  authCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the type of card used in the transaction.',
  })
  @Column({
    length: '2',
    name: 'TRANSACTION_CARD_TYPE',
    nullable: false,
  })
  cardType: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-06T14:49:53.508Z',
    description:
      'Represents the date and time that the transaction was submitted (user clicks Pay Now).',
  })
  @Column({
    name: 'TRANSACTION_SUBMIT_DATE',
    nullable: false,
  })
  transactionSubmitDate: string;

  @AutoMap()
  @ApiProperty({
    example: '6/23/2023 10:57:28 PM',
    description:
      'Represents the date and time that the transaction was processed.',
  })
  @Column({
    insert: false,
    update: false,
    name: 'TRANSACTION_DATE',
    nullable: false,
    type: 'date',
  })
  transactionDate: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the card cvd match status.',
  })
  @Column({
    name: 'CVD_ID',
    nullable: false,
  })
  cvdId: number;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  @Column({
    length: '2',
    name: 'PAYMENT_METHOD',
    nullable: false,
  })
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'The identifier of the user selected payment method.',
  })
  @Column({
    name: 'PAYMENT_METHOD_ID',
    nullable: false,
  })
  paymentMethodId: number;

  @AutoMap()
  @ApiProperty({
    example: '111',
    description:
      'References a detailed approved/declined transaction response message.',
  })
  @Column({
    name: 'MESSAGE_ID',
    nullable: false,
    type: 'int',
  })
  messageId: string;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description:
      'Represents basic approved/declined message for a transaction.',
  })
  @Column({
    length: '100',
    name: 'MESSAGE_TEXT',
    nullable: false,
  })
  messageText: string;

  // TODO: Implement many to many relationship for permits and transactions
  // Many permits can be associated with a transaction
  // Many transactions can be associated with a permit (example: cancelled, paid, refund, etc)

  @ManyToMany(() => Permit, (permit) => permit.permitId)
  @JoinTable({
    name: 'permit.ORBC_PERMIT_TRANSACTION',
    joinColumn: {
      name: 'transactionId',
      referencedColumnName: 'transactionId',
    },
    inverseJoinColumn: {
      name: 'permitId',
      referencedColumnName: 'permitId',
    },
  })
  permits: Permit[];

  @OneToOne(() => Receipt, (receipt) => receipt.transactionId)
  receipt: Receipt;
}
