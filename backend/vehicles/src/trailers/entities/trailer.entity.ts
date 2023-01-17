import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrailerType } from '../../trailer-types/entities/trailer-type.entity';
import { Province } from '../../common/entities/province.entity';
import { Base } from '../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'ORBC_TRAILER' })
export class Trailer extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Trailer ID',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'TRAILER_ID' })
  trailerId: string;

  @AutoMap()
  @ApiProperty({ example: '10', description: 'Unit Number' })
  @Column({ length: 10, name: 'UNIT_NUMBER', nullable: true })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({ example: 'CWJR 897665', description: 'Plate Number' })
  @Column({ length: 10, name: 'PLATE', nullable: false })
  plateNumber: string;

  @AutoMap(() => Province)
  @ManyToOne(() => Province)
  @JoinColumn({ name: 'PROVINCE_CODE' })
  province: Province;

  @AutoMap()
  @ApiProperty({ example: '2022', description: 'The year of Manufacture' })
  @Column({ type: 'smallint', width: 4, name: 'YEAR', nullable: false })
  year: number;

  @AutoMap()
  @ApiProperty({ example: 'Kenworth', description: 'Make of the vehicle' })
  @Column({ length: 50, name: 'MAKE', nullable: false })
  make: string;

  @AutoMap()
  @ApiProperty({ example: '1ZVFT80N475211367', description: 'VIN' })
  @Column({ length: 17, name: 'VIN', nullable: false })
  vin: string;

  @AutoMap()
  @ApiProperty({ example: '3.2', description: 'Empty Trailer Width' })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    name: 'EMPTY_TRAILER_WIDTH',
    nullable: false,
  })
  emptyTrailerWidth: number;

  @AutoMap(() => TrailerType)
  @ManyToOne(() => TrailerType, (TrailerType) => TrailerType.trailers)
  @JoinColumn({ name: 'TRAILER_TYPE_CODE' })
  trailerType: TrailerType;
}
