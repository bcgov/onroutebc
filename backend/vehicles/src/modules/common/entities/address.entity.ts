import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Province } from './province.entity';
import { Base } from './base.entity';
import { AutoMap } from '@automapper/classes';
import { Company } from '../../company/company-profiles/entities/company.entity';

@Entity({ name: 'ORBC_ADDRESS' })
export class Address extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ADDRESS_ID' })
  addressId: number;

  @AutoMap()
  @Column({ length: 150, name: 'ADDRESS_LINE_1', nullable: false })
  addressLine1: string;

  @AutoMap()
  @Column({ length: 100, name: 'ADDRESS_LINE_2', nullable: false })
  addressLine2: string;

  @AutoMap()
  @Column({ length: 100, name: 'CITY', nullable: false })
  city: string;

  @AutoMap(() => Province)
  @ManyToOne(() => Province, (Province) => Province.contacts, { eager: true })
  @JoinColumn({ name: 'PROVINCE_ID' })
  province: Province;

  @AutoMap()
  @Column({ length: 7, name: 'POSTAL_CODE', nullable: false })
  postalCode: string;

  @AutoMap(() => Company)
  @OneToOne(() => Company, (Company) => Company.primaryContact)
  company: Company;
}
