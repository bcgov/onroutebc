import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'permit.ORBC_TRANSACTION' })
export class Transaction extends Base {
  @AutoMap()
  @ApiProperty({
    example: '10000148',
    description: 'Unique identifier for the transaction metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  transactionId: string;


  @AutoMap()
  @ApiProperty({
    example: 'true',
    description: 'Represents the approval result of a transaction.',
  })
  @Column({ type: 'boolean', name: 'TRANSACTION_APPROVED', nullable: false })
  approved: boolean;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description: 'Represents the auth code of a transaction.',
  })
  @Column({
    length: '10',
    name: 'TRANSACTION_AUTH_CODE',
    nullable: false,
  })
  authCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the card type of a transaction.',
  })
  @Column({
    length: '5',
    name: 'TRANSACTION_CARD_TYPE',
    nullable: false,
  })
  cardType: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the card type of a transaction.',
  })
  @Column({
    name: 'TRANSACTION_CVD_ID',
    nullable: false,
  })
  cvdId: number;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  @Column({
    length: '5',
    name: 'TRANSACTION_PAYMENT_METHOD',
    nullable: false,
  })
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 'T',
    description: 'Represents the response type of a transaction.',
  })
  @Column({
    length: '5',
    name: 'TRANSACTION_RESPONSE_TYPE',
    nullable: false,
  })
  responseType: string;

  @AutoMap()
  @ApiProperty({
    example: '6/23/2023 10:57:28 PM',
    description: 'Represents the date and time of a transaction.',
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
    example: 'eng',
    description: 'Represents the language of a transaction.',
  })
  @Column({
    length: '10',
    name: 'TRANSACTION_LANGUAGE',
    nullable: false,
  })
  language: string;

  @AutoMap()
  @ApiProperty({
    example: 'P',
    description: 'Represents the transaction type of a transaction.',
  })
  @Column({
    length: '5',
    name: 'TRANSACTION_TYPE',
    nullable: false,
  })
  transactionType: string;

  @AutoMap()
  @ApiProperty({
    example: '111',
    description: 'Unique identifier for the transaction metadata.',
  })
  @Column({
    name: 'TRANSACTION_MESSAGE_ID',
    nullable: false,
    type: 'bigint',
  })
  messageId: string;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description: 'Represents the success or failure message text for a transaction.',
  })
  @Column({
    length: '100',
    name: 'TRANSACTION_MESSAGE_TEXT',
    nullable: false,
  })
  messageText: string;

  @ManyToOne(() => Payment, payment => payment.transactions)
  payment: Payment;

}
