import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_PAYMENT_CARD_TYPE' })
export class PaymentCardType {
  @AutoMap()
  @PrimaryColumn({ name: 'PAYMENT_CARD_TYPE', length: 5, nullable: false })
  paymentCardTypeCode: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: false, length: 20 })
  name: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true, length: 50 })
  description: string;
}
