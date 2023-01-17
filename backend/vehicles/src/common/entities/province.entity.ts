import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Country } from './country.entity';
import { PowerUnit } from '../../power-units/entities/power-unit.entity';
import { Trailer } from '../../trailers/entities/trailer.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'ORBC_VT_PROVINCE' })
export class Province extends Base {
  @AutoMap()
  @ApiProperty({ example: 'BC', description: 'Province Code' })
  @PrimaryColumn({ length: 2, name: 'PROVINCE_CODE', nullable: false })
  provinceCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'British Columbia',
    description: 'Province Name',
  })
  @Column({ length: 100, name: 'PROVINCE_NAME', nullable: false })
  provinceName: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @AutoMap()
  @ManyToOne(() => Country, (Country) => Country.provinces)
  @JoinColumn({ name: 'COUNTRY_CODE' })
  country: Country;

  @AutoMap(() => [PowerUnit])
  @ApiProperty({ description: 'Power Unit' })
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.province)
  powerUnits: PowerUnit[];

  @AutoMap(() => [Trailer])
  @ApiProperty({ description: 'Trailer' })
  @OneToMany(() => Trailer, (Trailer) => Trailer.province)
  trailers: Trailer[];
}
