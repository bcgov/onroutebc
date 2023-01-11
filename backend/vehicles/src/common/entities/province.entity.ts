import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Base } from './base.entity';
import { Country } from './country.entity';
import { PowerUnit } from '../../power-units/entities/power-unit.entity';
import { Trailer } from '../../trailers/entities/trailer.entity';

@Entity({ name: 'ORBC_VT_PROVINCE' })
export class Province extends Base {
  @ApiProperty({
    example: '1',
    description: 'The Province ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'PROVINCE_ID' })
  provinceId: number;

  @ApiProperty({
    example: 'British Columbia',
    description: 'Province Name',
  })
  @Column({ length: 100, name: 'PROVINCE_NAME', nullable: false })
  provinceName: string;

  @ApiProperty({ example: 'BC', description: 'Province Code' })
  @Column({ length: 2, name: 'PROVINCE_CODE', nullable: false })
  provinceCode: string;

  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @ApiProperty({ example: '1', description: 'Primary Key of Country' })
  @ManyToOne(() => Country, (Country) => Country.provinces)
  @JoinColumn({ name: 'COUNTRY_ID' })
  country: Country;

  @ApiProperty({ description: 'Power Unit' })
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.province)
  powerUnits: PowerUnit[];

  @ApiProperty({ description: 'Trailer' })
  @OneToMany(() => Trailer, (Trailer) => Trailer.province)
  trailers: Trailer[];
}
