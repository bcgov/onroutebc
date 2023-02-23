import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Address } from '../../../common/entities/address.entity';
import { Contact } from '../../../common/entities/contact.entity';
import { CompanyUser } from '../../users/entities/company-user.entity';
import { CompanyDirectory } from '../../../../common/enum/directory.enum';

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
  @Column({
    type: 'simple-enum',
    enum: CompanyDirectory,
    length: 10,
    name: 'COMPANY_DIRECTORY',
    nullable: false,
  })
  companyDirectory: CompanyDirectory;

  @OneToOne(() => Address, (Address) => Address.company, { cascade: true })
  @JoinColumn({ name: 'PHYSICAL_ADDRESS_ID' })
  companyAddress: Address;

  @OneToOne(() => Address, (Address) => Address.company, { cascade: true })
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
  @OneToOne(() => Contact, (Contact) => Contact.company, { cascade: true })
  @JoinColumn({ name: 'PRIMARY_CONTACT_ID' })
  primaryContact: Contact;

  @AutoMap(() => [CompanyUser])
  @OneToMany(() => CompanyUser, (CompanyUser) => CompanyUser.company)
  companyUsers: CompanyUser[];

  public get mailingAddressSameAsCompanyAddress(): boolean {
    return this.companyAddress.addressId === this.mailingAddress.addressId;
  }
  public setMailingAddressSameAsCompanyAddress(
    mailingAddressSameAsCompanyAddress: boolean,
  ) {
    if (mailingAddressSameAsCompanyAddress) {
      this.mailingAddress = this.companyAddress;
    }
  }
}
