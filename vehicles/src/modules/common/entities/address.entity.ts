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

@Entity({ name: 'ORBC_ADDRESS' })
export class Address extends Base {
  /**
   * An auto-generated unique identifier for the address.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ADDRESS_ID' })
  addressId: number;

  /**
   * The first line of the address.
   */
  @AutoMap()
  @Column({ length: 150, name: 'ADDRESS_LINE_1', nullable: false })
  addressLine1: string;

  /**
   * The second line of the address.
   */
  @AutoMap()
  @Column({ length: 100, name: 'ADDRESS_LINE_2', nullable: false })
  addressLine2: string;

  /**
   * The city where the address is located.
   */
  @AutoMap()
  @Column({ length: 100, name: 'CITY', nullable: false })
  city: string;

  /**
   * A many-to-one relationship to the Province entity, representing the
   * province or state where the address is located. The relationship is
   * eager-loaded and the foreign key column name is PROVINCE_ID.
   */
  @AutoMap(() => Province)
  @ManyToOne(() => Province, (Province) => Province.contacts, { eager: true })
  @JoinColumn({ name: 'PROVINCE_TYPE' })
  province: Province;

  /**
   * The postal code or ZIP code for the address, with a maximum length of 7
   * characters.
   */
  @AutoMap()
  @Column({ length: 15, name: 'POSTAL_CODE', nullable: false })
  postalCode: string;

  /**
   * A one-to-one relationship to the Company entity, representing the company
   * that the address belongs to. The relationship is mapped by the
   * mailingAddress field in the Company entity.
   */
  @AutoMap(() => Company)
  @OneToOne(() => Company, (Company) => Company.mailingAddress)
  company: Company;
}
