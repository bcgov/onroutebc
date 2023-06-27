import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Permit } from 'src/modules/permit/entities/permit.entity';

@Entity({ name: 'permit.ORBC_TRANSACTION' })
export class Transaction extends Base {
  @AutoMap()
  @ApiProperty({
    example: '10000148',
    description: 'Bambora-assigned eight-digit unique id number used to identify an individual transaction.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'TRANSACTION_ID' })
  transactionId: string;


  @AutoMap()
  @ApiProperty({
    example: 'P',
    description: 'Represents the original value sent to indicate the type of transaction to perform (i.e. P, R, VP, VR, PA, PAC, Q).',
  })
  @Column({
    length: '3',
    name: 'TRANSACTION_TYPE',
    nullable: false,
  })
  transactionType: string;

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
    description: 'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  @Column({ type: 'number', name: 'TRANSACTION_APPROVED', nullable: false })
  approved: number;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description: 'Represents the auth code of a transaction. If the transaction is approved this parameter will contain a unique bank-issued code.',
  })
  @Column({
    length: '32',
    name: 'TRANSACTION_AUTH_CODE',
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
    example: '6/23/2023 10:57:28 PM',
    description: 'Represents the date and time that the transaction was processed.',
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
    length: '2',
    name: 'TRANSACTION_PAYMENT_METHOD',
    nullable: false,
  })
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: '111',
    description: 'References a detailed approved/declined transaction response message.',
  })
  @Column({
    name: 'TRANSACTION_MESSAGE_ID',
    nullable: false,
    type: 'int',
  })
  messageId: string;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description: 'Represents basic approved/declined message for a transaction.',
  })
  @Column({
    length: '100',
    name: 'TRANSACTION_MESSAGE_TEXT',
    nullable: false,
  })
  messageText: string;

  @ManyToMany(() => Permit)
  @JoinTable()
  permits: Permit[]

}
