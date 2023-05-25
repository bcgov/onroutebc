import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_VT_PERMIT_TYPE' })
export class PermitType {
  @AutoMap()
  @PrimaryColumn({ name: 'PERMIT_TYPE_ID' })
  permitTypeId: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: true })
  name: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;
}
