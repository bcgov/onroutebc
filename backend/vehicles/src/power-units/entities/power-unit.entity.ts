import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PowerUnitType } from '../../power-unit-types/entities/power-unit-type.entity';
import { Province } from '../../common/entities/province.entity';
import { Base } from '../../common/entities/base.entity';

@Entity({ name: 'ORBC_POWER_UNIT' })
export class PowerUnit extends Base {
  @ApiProperty({
    example: '1',
    description: 'The Power Unit ID',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'POWER_UNIT_ID' })
  powerUnitId: string;

  @ApiProperty({ example: '10', description: 'Unit Number' })
  @Column({ length: 10, name: 'UNIT_NUMBER', nullable: true })
  unitNumber: string;

  @ApiProperty({ example: 'CWJR 897665', description: 'Plate Number' })
  @Column({ length: 10, name: 'PLATE', nullable: false })
  plateNumber: string;

  @ApiProperty({
    example: 'BC',
    description: 'The Prov where the vehicle was registered',
  })
  @ManyToOne(() => Province, (Province) => Province.powerUnits)
  @JoinColumn({ name: 'PROVINCE_ID' })
  province: Province;

  @ApiProperty({ example: '2022', description: 'The year of Manufacture' })
  @Column({ type: 'smallint', width: 4, name: 'YEAR', nullable: false })
  year: number;

  @ApiProperty({ example: 'Kenworth', description: 'Make of the vehicle' })
  @Column({ length: 50, name: 'MAKE', nullable: false })
  make: string;

  @ApiProperty({ example: '1ZVFT80N475211367', description: 'VIN' })
  @Column({ length: 17, name: 'VIN', nullable: false })
  vin: string;

  @ApiProperty({ example: '63500', description: 'Licensed GVW' })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    name: 'LICENSED_GVW',
    nullable: false,
  })
  licensedGvw: number;

  @ApiProperty({ example: '1', description: 'Power Unit Type Id' })
  @ManyToOne(() => PowerUnitType, (powerUnitType) => powerUnitType.powerUnits)
  @JoinColumn({ name: 'POWER_UNIT_TYPE_ID' })
  powerUnitType: PowerUnitType;

  @ApiProperty({ example: '12', description: 'Steer Axle Tire Size' })
  @Column({ type: 'integer', name: 'STEER_AXLE_TIRE_SIZE', nullable: true })
  steerAxleTireSize: number;
}
