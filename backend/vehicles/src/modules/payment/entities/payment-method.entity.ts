import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_PAYMENT_METHOD_TYPE' })
export class PaymentMethod {
  @AutoMap()
  @PrimaryColumn({ name: 'PAYMENT_METHOD_ID' })
  permitTypeId: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: true })
  name: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;
}
