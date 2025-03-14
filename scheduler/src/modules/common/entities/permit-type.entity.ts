import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'permit.ORBC_PERMIT_TYPE' })
export class PermitType {
  @AutoMap()
  @PrimaryColumn({ name: 'PERMIT_TYPE' })
  permitTypeId: string;

  @AutoMap()
  @Column({ name: 'NAME', nullable: true })
  name: string;

  @AutoMap()
  @Column({ name: 'GL_CODE', nullable: true })
  glCode: string;

  @AutoMap()
  @Column({ name: 'GARMS_SERVICE_CODE', nullable: true })
  serviceCode: string;
}
