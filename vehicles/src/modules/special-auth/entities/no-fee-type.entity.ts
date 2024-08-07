import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';

@Entity({ name: 'permit.ORBC_NO_FEE_TYPE' })
export class NoFeeType extends Base {
  @AutoMap()
  @PrimaryColumn({ name: 'NO_FEE_TYPE' })
  noFeeType: string;

  @AutoMap()
  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;
}
