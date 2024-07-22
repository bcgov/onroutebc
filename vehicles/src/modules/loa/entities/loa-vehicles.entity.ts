import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';
import { LoaDetail } from './loa-detail.entity';
import { PowerUnit } from 'src/modules/vehicles/power-units/entities/power-unit.entity';
import { Trailer } from 'src/modules/vehicles/trailers/entities/trailer.entity';

@Entity({ name: 'permit.ORBC_LOA_VEHICLES' })
export class LoaVehicle extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'LOA_VEHICLE_ID' })
  loavehicleId: number;

  @AutoMap(() => LoaDetail)
  @ManyToOne(() => LoaDetail, (LoaDetail) => LoaDetail.loaVehicles)
  @JoinColumn({ name: 'LOA_ID' })
  loa: LoaDetail;

  @AutoMap(() => PowerUnit)
  @OneToOne(() => PowerUnit, (PowerUnit) => PowerUnit.powerUnitId, {
    nullable: true,
  })
  @JoinColumn({ name: 'POWER_UNIT_ID' })
  powerUnit: PowerUnit;

  @AutoMap(() => Trailer)
  @OneToOne(() => Trailer, (Trailer) => Trailer.trailerId, { nullable: true })
  @JoinColumn({ name: 'TRAILER_ID' })
  trailer: Trailer;
}
