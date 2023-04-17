import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PowerUnitType } from '../../power-unit-types/entities/power-unit-type.entity';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../../common/entities/base.entity';
import { Province } from '../../../common/entities/province.entity';

@Entity({ name: 'ORBC_POWER_UNIT' })
export class PowerUnit extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Unique identifier for this vehicle record in a company inventory.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'POWER_UNIT_ID' })
  powerUnitId: string;

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
  @ManyToOne(() => Province, (Province) => Province.powerUnits)
  @JoinColumn({ name: 'PROVINCE_ID' })
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
      'Short vehicle identification number (last 6 characters) for the power unit.',
  })
  @Column({ length: 6, name: 'VIN', nullable: false })
  vin: string;

  @AutoMap()
  @ApiProperty({
    example: '63500',
    description: 'Licensed gross vehicle weight of the power unit.',
  })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    name: 'LICENSED_GVW',
    nullable: true,
  })
  licensedGvw: number;

  @AutoMap(() => PowerUnitType)
  @ManyToOne(() => PowerUnitType, (powerUnitType) => powerUnitType.powerUnits)
  @JoinColumn({ name: 'POWER_UNIT_TYPE_CODE' })
  powerUnitType: PowerUnitType;

  @AutoMap()
  @ApiProperty({
    example: '12',
    description: 'Size of the steer axle tires (width).',
  })
  @Column({ type: 'integer', name: 'STEER_AXLE_TIRE_SIZE', nullable: true })
  steerAxleTireSize: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Company Id to which the Power Unit belongs',
  })
  @Column({
    update: false,
    type: 'integer',
    name: 'COMPANY_ID',
    nullable: false,
  })
  companyId: number;
}
