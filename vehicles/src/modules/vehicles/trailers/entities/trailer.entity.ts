import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrailerType } from '../../trailer-types/entities/trailer-type.entity';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../../common/entities/base.entity';
import { Province } from '../../../common/entities/province.entity';

@Entity({ name: 'ORBC_TRAILER' })
export class Trailer extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Unique identifier for this vehicle record in a company inventory.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'TRAILER_ID' })
  trailerId: string;

  @AutoMap()
  @ApiProperty({
    example: '10',
    description:
      'Number or code that the company uses to refer to the vehicle.',
  })
  @Column({ length: 10, name: 'UNIT_NUMBER', nullable: true })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({ example: 'CWJR 897665', description: 'License plate.' })
  @Column({ length: 10, name: 'PLATE', nullable: false })
  plate: string;

  @AutoMap(() => Province)
  @ManyToOne(() => Province)
  @JoinColumn({ name: 'PROVINCE_TYPE' })
  province: Province;

  @AutoMap()
  @ApiProperty({
    example: '2022',
    description: 'Year of manufacture of the vehicle.',
  })
  @Column({ type: 'smallint', width: 4, name: 'YEAR', nullable: false })
  year: number;

  @AutoMap()
  @ApiProperty({
    example: 'Kenworth',
    description: 'Make (manufacturer) of the vehicle.',
  })
  @Column({ length: 50, name: 'MAKE', nullable: false })
  make: string;

  @AutoMap()
  @ApiProperty({
    example: '1ZVFT8',
    description:
      'Short vehicle identification number (last 6 characters) for the trailer.',
  })
  @Column({ length: 6, name: 'VIN', nullable: false })
  vin: string;

  @AutoMap()
  @ApiProperty({
    example: '3.2',
    description: 'Width in metres of the empty trailer.',
  })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    name: 'EMPTY_TRAILER_WIDTH',
    nullable: true,
  })
  emptyTrailerWidth: number;

  @AutoMap(() => TrailerType)
  @ManyToOne(() => TrailerType, (TrailerType) => TrailerType.trailers)
  @JoinColumn({ name: 'TRAILER_TYPE' })
  trailerType: TrailerType;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Company Id to which the Trailer belongs',
  })
  @Column({
    update: false,
    type: 'int',
    name: 'COMPANY_ID',
    nullable: false,
  })
  companyId: number;
}
