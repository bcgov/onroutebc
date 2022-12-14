import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PowerUnitType } from './powerUnitType.entity';
import { ProvinceState } from './provinceState.entity';
import { BaseEntity } from './base.entity';

@Entity({ schema: 'ort_vehicles', name: 'ORT_POWER_UNIT' })
export class PowerUnit extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'The Power Unit ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'POWER_UNIT_ID' })
  powerUnitId: number;

  @ApiProperty({ example: '10', description: 'Unit Number' })
  @Column({ length: 10, name: 'UNIT_NUMBER', nullable: true })
  unitNumber: string;

  @ApiProperty({ example: 'CWJR 897665', description: 'Plate Number' })
  @Column({ length: 10, name: 'PLATE_NUMBER', nullable: false })
  plateNumber: string;

  @ApiProperty({
    example: 'BC',
    description: 'The Prov/State where the vehicle was registered',
  })
  @ManyToOne(() => ProvinceState)
  @JoinColumn({ name: 'PROVINCE_STATE_ID' })
  provinceState: ProvinceState;

  @ApiProperty({ example: '2022', description: 'The year of Manufacture' })
  @Column({ type: 'integer', width: 4, name: 'YEAR', nullable: false })
  year: number;

  @ApiProperty({ example: 'Kenworth', description: 'Make of the vehicle' })
  @Column({ length: 50, name: 'MAKE', nullable: false })
  make: string;

  @ApiProperty({ example: '1ZVFT80N475211367', description: 'VIN' })
  @Column({ length: 17, name: 'VIN', nullable: false })
  vin: string;

  @ApiProperty({ example: '63500', description: 'Licensed GVW' })
  @Column({ type: 'integer', width: 40, name: 'LICENSED_GVW', nullable: false })
  licensedGvw: number;

  @ApiProperty({ example: '1', description: 'Power Unit Type Id' })
  @ManyToOne(() => PowerUnitType, (powerUnitType) => powerUnitType.powerUnits)
  @JoinColumn({ name: 'POWER_UNIT_TYPE_ID' })
  powerUnitType: PowerUnitType;

  @ApiProperty({ example: 'TODO', description: 'Steer Axle Tire Size' })
  @Column({ type: 'integer', name: 'STEER_AXLE_TIRE_SIZE', nullable: true })
  steerAxleTireSize: number;
}
