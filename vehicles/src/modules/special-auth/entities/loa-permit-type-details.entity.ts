import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { LoaDetail } from './loa-detail.entity';

@Entity({ name: 'permit.ORBC_LOA_PERMIT_TYPE_DETAILS' })
export class LoaPermitType extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'LOA_PERMIT_TYPE_ID' })
  id: number;

  @AutoMap(() => LoaDetail)
  @ManyToOne(() => LoaDetail, (LoaDetail) => LoaDetail.loaPermitTypes)
  @JoinColumn({ name: 'LOA_ID' })
  loa: LoaDetail;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type',
    example: PermitType.TERM_OVERSIZE,
  })
  @Column({
    type: 'simple-enum',
    enum: PermitType,
    length: 10,
    name: 'PERMIT_TYPE',
    nullable: false,
  })
  permitType: PermitType;
}
