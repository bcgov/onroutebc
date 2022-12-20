import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProvinceState } from './provinceState.entity';

@Entity({ name: 'ORBC_VT_COUNTRY' })
export class Country extends BaseEntity {
  @ApiProperty({ example: '1', description: 'The Country ID' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'COUNTRY_ID' })
  countryId: number;

  @ApiProperty({ example: 'CANADA', description: 'Country Name' })
  @Column({ length: 50, name: 'COUNTRY_NAME', nullable: false })
  countryName: string;

  // @ApiProperty({ example: 'CA', description: 'Country Code' })
  // @Column({ length: 2, name: 'COUNTRY_CODE', nullable: false })
  // countryCode: string;

  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @ApiProperty({ description: 'Province State' })
  @OneToMany(() => ProvinceState, (ProvinceState) => ProvinceState.country)
  provinceStates: ProvinceState[];
}
