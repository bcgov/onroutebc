import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from '../../common/entities/province.entity';
import { Base } from '../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Company } from './company.entity';

@Entity({ name: 'ORBC_CONTACT' })
export class Contact extends Base {
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'CONTACT_ID' })
  contactId: string;

  @AutoMap()
  @Column({ length: 150, name: 'ADDRESS_LINE_1', nullable: false })
  addressLine1: string;

  @AutoMap()
  @Column({ length: 150, name: 'ADDRESS_LINE_2', nullable: false })
  addressLine2: string;

  @AutoMap()
  @Column({ length: 100, name: 'CITY', nullable: false })
  city: string;

  @AutoMap(() => Province)
  @ManyToOne(() => Province, (Province) => Province.contacts)
  @JoinColumn({ name: 'PROVINCE_ID' })
  province: Province;

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

  @AutoMap(() => Company)
  @ManyToOne(() => Company, (Company) => Company.primaryContact)
  @JoinColumn({ name: 'CONTACT_ID' })
  company: Company;
}
