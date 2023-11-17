import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_PAYMENT_TYPE' })
export class PaymentType {
  @AutoMap()
  @PrimaryColumn({ name: 'PAYMENT_TYPE', length: 5, nullable: false })
  paymentTypeCode: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: false, length: 20 })
  name: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true, length: 50 })
  description: string;
}
