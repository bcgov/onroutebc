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
import { Company } from '../../company-user-management/company/entities/company.entity';

@Entity({ name: 'ORBC_CONTACT' })
export class Contact extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'CONTACT_ID' })
  contactId: number;

  @AutoMap()
  @Column({ length: 100, name: 'FIRST_NAME', nullable: false })
  firstName: string;

  @AutoMap()
  @Column({ length: 100, name: 'LAST_NAME', nullable: false })
  lastName: string;

  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: false })
  email: string;

  @AutoMap()
  @Column({ length: 20, name: 'PHONE_1', nullable: false })
  phone1: string;

  @AutoMap()
  @Column({ length: 5, name: 'EXTENSION_1', nullable: false })
  extension1: string;

  @AutoMap()
  @Column({ length: 20, name: 'PHONE_2', nullable: false })
  phone2: string;

  @AutoMap()
  @Column({ length: 5, name: 'EXTENSION_2', nullable: false })
  extension2: string;

  @AutoMap()
  @Column({ length: 20, name: 'FAX', nullable: false })
  fax: string;

  @AutoMap()
  @Column({ length: 100, name: 'CITY', nullable: false })
  city: string;

  @AutoMap(() => Province)
  @ManyToOne(() => Province, (Province) => Province.addresses, { eager: true })
  @JoinColumn({ name: 'PROVINCE_ID' })
  province: Province;

  @AutoMap(() => Company)
  @OneToOne(() => Company, (Company) => Company.companyAddress)
  company: Company;
}
