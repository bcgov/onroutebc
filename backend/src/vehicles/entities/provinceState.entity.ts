import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Country } from './country.entity';
import { PowerUnit } from './powerUnit.entity';
import { Trailer } from './trailer.entity';

@Entity({ schema: 'ort_vehicles', name: 'ORT_PROVINCE_STATE' })
export class ProvinceState extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'The Province/State ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'PROVINCE_STATE_ID' })
  provinceStateId: number;

  @ApiProperty({
    example: 'British Columbia',
    description: 'Province State Name',
  })
  @Column({ length: 100, name: 'PROVINCE_STATE_NAME', nullable: false })
  provinceStateName: string;

  @ApiProperty({ example: 'BC', description: 'Province State Code' })
  @Column({ length: 2, name: 'PROVINCE_STATE_CODE', nullable: false })
  provinceStateCode: string;

  @ApiProperty({ example: '1', description: 'Primary Key of Country' })
  @ManyToOne(() => Country, (Country) => Country.provinceStates)
  @JoinColumn({ name: 'COUNTRY_ID' })
  country: Country;

  @ApiProperty({ example: 'TODO', description: 'Power Unit' })
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.provinceState)
  powerUnits: PowerUnit[];

  @ApiProperty({ example: 'TODO', description: 'Power Unit' })
  @OneToMany(() => Trailer, (Trailer) => Trailer.provinceState)
  trailers: Trailer[];
}
