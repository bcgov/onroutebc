import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from './base.entity';
import { Province } from './province.entity';

@Entity({ name: 'ORBC_VT_COUNTRY' })
export class Country extends Base {
  @AutoMap()
  @ApiProperty({ example: 'CA', description: 'Country Code' })
  @PrimaryColumn({ length: 2, name: 'COUNTRY_CODE', nullable: false })
  countryCode: string;

  @AutoMap()
  @ApiProperty({ example: 'CANADA', description: 'Country Name' })
  @Column({ length: 50, name: 'COUNTRY_NAME', nullable: false })
  countryName: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @AutoMap()
  @ApiProperty({ description: 'Province' })
  @OneToMany(() => Province, (Province) => Province.country)
  provinces: Province[];
}
