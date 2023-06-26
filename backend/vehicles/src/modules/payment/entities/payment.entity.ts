import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Transaction } from './transaction.entity';
import { Permit } from 'src/modules/permit/entities/permit.entity';

@Entity({ name: 'permit.ORBC_PAYMENT' })
export class Payment extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the payment metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  paymentId: string;


  @AutoMap()
  @ApiProperty({
    example: '348270000',
    description: 'Represents the merchant id for a payment.',
  })
  @Column({ type: 'bigint', name: 'MERCHANT_ID', nullable: false })
  merchantId: string;

  @AutoMap()
  @ApiProperty({
    example: 'T-1687794863576',
    description: 'Represents the order number for a payment.',
  })
  @Column({
    length: '20',
    name: 'ORDER_NUMBER',
    nullable: false,
  })
  applicationNumber: string;


  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the number of the payment amount.',
  })
  @Column({
    length: '19',
    name: 'PAYMENT_AMOUNT',
    nullable: false,
  })
  paymentAmount: number;

  @OneToMany(() => Transaction, transaction => transaction.payment)
  transactions: Transaction[];

  // //bruce test
  // @ManyToMany(() => Permit, permit => permit.payments)
  // permits: Permit[];

  @ManyToMany(() => Permit)
  @JoinTable()
  permits: Permit[]

}
