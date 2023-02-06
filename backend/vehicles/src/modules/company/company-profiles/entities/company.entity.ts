import { Entity, Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Base } from '../../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Contact } from './contact.entity';
import { Address } from './address.entity';

@Entity({ name: 'ORBC_COMPANY' })
export class Company extends Base {
  @AutoMap()
  @PrimaryColumn({ length: 32, name: 'COMPANY_GUID', nullable: false })
  companyGUID: string;

  @AutoMap()
  @Column({ length: 10, name: 'CLIENT_NUMBER', nullable: false })
  clientNumber: string;

  @AutoMap()
  @Column({ length: 100, name: 'LEGAL_NAME', nullable: false })
  legalName: string;

  @AutoMap()
  @Column({ length: 10, name: 'COMPANY_DIRECTORY', nullable: false })
  companyDirectory: string;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (Address) => Address.company)
  @JoinColumn({ name: 'PHYSICAL_ADDRESS_ID' })
  companyAddress: Address;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (Address) => Address.company)
  @JoinColumn({ name: 'MAILING_ADDRESS_ID' })
  mailingAddress: Address;

  @AutoMap()
  @Column({ length: 20, name: 'PHONE', nullable: false })
  phone: string;

  @AutoMap()
  @Column({ length: 5, name: 'EXTENSION', nullable: false })
  extension: string;

  @AutoMap()
  @Column({ length: 20, name: 'FAX', nullable: false })
  fax: string;

  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: false })
  email: string;

  @AutoMap(() => Contact)
  @OneToOne(() => Contact, (Contact) => Contact.company)
  @JoinColumn({ name: 'PRIMARY_CONTACT_ID' })
  primaryContact: Contact;
}
