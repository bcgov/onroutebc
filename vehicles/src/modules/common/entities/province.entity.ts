import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { AutoMap } from '@automapper/classes';
import { Contact } from './contact.entity';
import { Address } from './address.entity';
import { PowerUnit } from '../../vehicles/power-units/entities/power-unit.entity';
import { Trailer } from '../../vehicles/trailers/entities/trailer.entity';

@Entity({ name: 'ORBC_PROVINCE_TYPE' })
export class Province {
  @AutoMap()
  @ApiProperty({ example: 'CA-BC', description: 'Province ID' })
  @PrimaryColumn({ length: 5, name: 'PROVINCE_TYPE', nullable: false })
  provinceId: string;

  @AutoMap()
  @ApiProperty({ example: 'BC', description: 'Province Code' })
  @Column({ length: 2, name: 'PROVINCE_CODE', nullable: false })
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
  @ManyToOne(() => Country, (Country) => Country.provinces, { eager: true })
  @JoinColumn({ name: 'COUNTRY_TYPE' })
  country: Country;

  @AutoMap(() => [PowerUnit])
  @ApiProperty({ description: 'Power Unit' })
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.province)
  powerUnits: PowerUnit[];

  @AutoMap(() => [Trailer])
  @ApiProperty({ description: 'Trailer' })
  @OneToMany(() => Trailer, (Trailer) => Trailer.province)
  trailers: Trailer[];

  @AutoMap(() => [Address])
  @OneToMany(() => Address, (Address) => Address.province)
  addresses: Address[];

  @AutoMap(() => [Contact])
  @OneToMany(() => Contact, (Contact) => Contact.province)
  contacts: Contact[];
}
