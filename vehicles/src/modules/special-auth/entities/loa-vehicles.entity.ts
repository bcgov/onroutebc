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
  @PrimaryGeneratedColumn({ type: 'int', name: 'LOA_VEHICLE_ID' })
  loavehicleId: number;

  @AutoMap(() => LoaDetail)
  @ManyToOne(() => LoaDetail, (LoaDetail) => LoaDetail.loaVehicles)
  @JoinColumn({ name: 'LOA_ID' })
  loa: LoaDetail;

  @AutoMap()
  @Column({
    name: 'POWER_UNIT_TYPE',
    nullable: true,
  })
  powerUnitType?: string;

  @AutoMap()
  @Column({
    name: 'TRAILER_TYPE',
    nullable: true,
  })
  trailerType?: string;
}
