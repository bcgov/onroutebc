import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_PAYMENT_METHOD_TYPE' })
export class PaymentMethod {
  @AutoMap()
  @PrimaryColumn({ name: 'PAYMENT_METHOD_TYPE' })
  permitTypeId: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: false, length: 20 })
  name: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true, length: 50 })
  description: string;
}
