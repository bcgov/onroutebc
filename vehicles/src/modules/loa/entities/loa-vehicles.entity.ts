import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { LoaDetail } from './loa-detail.entity';

@Entity({ name: 'permit.ORBC_LOA_VEHICLES' })
export class LoaVehicle extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Id for the loa allowed vehicles',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'LOA_VEHICLE_ID' })
  loavehicleId: string;

  @AutoMap(() => LoaDetail)
  @ManyToOne(() => LoaDetail, (LoaDetail) => LoaDetail.loaVehicles, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'LOA_ID' })
  loa: LoaDetail;

  @AutoMap()
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Power unit id.',
  })
  @Column({
    name: 'POWER_UNIT_ID',
    nullable: true,
  })
  powerUnit: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Power unit id.',
  })
  @Column({
    name: 'TRAILER_ID',
    nullable: true,
  })
  trailer: string;
}
