import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { Address } from '../../../common/entities/address.entity';
import { Contact } from '../../../common/entities/contact.entity';
import { CompanyUser } from '../../users/entities/company-user.entity';
import { CompanyDirectory } from '../../../../common/enum/directory.enum';

@Entity({ name: 'ORBC_COMPANY' })
export class Company extends Base {
  /**
   * An auto-generated unique identifier for the company.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'COMPANY_ID' })
  companyId: number;

  /**
   * The company's GUID.
   */
  @AutoMap()
  @Column({ length: 32, name: 'COMPANY_GUID', nullable: true })
  companyGUID: string;

  /**
   * The ORBC client number of the company.
   */
  @AutoMap()
  @Column({ length: 15, name: 'CLIENT_NUMBER', nullable: true })
  clientNumber: string;

  /**
   * The company's legal name.
   */
  @AutoMap()
  @Column({ length: 100, name: 'LEGAL_NAME', nullable: false })
  legalName: string;

  /**
   * A property that represents the company's directory, which is an enum of
   * type {@link CompanyDirectory}.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: CompanyDirectory,
    length: 10,
    name: 'COMPANY_DIRECTORY',
    nullable: false,
  })
  companyDirectory: CompanyDirectory;

  /**
   * A one-to-one relationship with the {@link Address} entity, representing the
   * company's physical address
   */
  @OneToOne(() => Address, (Address) => Address.company, { cascade: true })
  @JoinColumn({ name: 'PHYSICAL_ADDRESS_ID' })
  companyAddress: Address;

  /**
   * A one-to-one relationship with the {@link Address} entity, representing the
   * company's mailing address.
   */
  @OneToOne(() => Address, (Address) => Address.company, { cascade: true })
  @JoinColumn({ name: 'MAILING_ADDRESS_ID' })
  mailingAddress: Address;

  /**
   * The company's phone number.
   */
  @AutoMap()
  @Column({ length: 20, name: 'PHONE', nullable: false })
  phone: string;

  /**
   * The company's phone extension.
   */
  @AutoMap()
  @Column({ length: 5, name: 'EXTENSION', nullable: false })
  extension: string;

  /**
   * The company's fax number.
   */
  @AutoMap()
  @Column({ length: 20, name: 'FAX', nullable: false })
  fax: string;

  /**
   * The company's email address.
   */
  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: false })
  email: string;

  /**
   * The company's primary contact.
   */
  @AutoMap(() => Contact)
  @OneToOne(() => Contact, (Contact) => Contact.company, { cascade: true })
  @JoinColumn({ name: 'PRIMARY_CONTACT_ID' })
  primaryContact: Contact;

  /**
   * A one-to-many relationship with the {@link CompanyUser} entity, representing the
   * users who belong to the company.
   */
  @AutoMap(() => [CompanyUser])
  @OneToMany(() => CompanyUser, (CompanyUser) => CompanyUser.company)
  companyUsers: CompanyUser[];

  /**
   * The mailingAddressSameAsCompanyAddress property is a getter that returns a
   * boolean value indicating whether the mailing address is the same as the
   * company address.
   */
  public get mailingAddressSameAsCompanyAddress(): boolean {
    return this.companyAddress.addressId === this.mailingAddress.addressId;
  }

  /**
   * setMailingAddressSameAsCompanyAddress() method sets the mailing address to
   * the company address if the parameter is true.
   * @param mailingAddressSameAsCompanyAddress sets the mailing address to the
   * company address if the parameter is true.
   */
  public setMailingAddressSameAsCompanyAddress(
    mailingAddressSameAsCompanyAddress: boolean,
  ) {
    if (mailingAddressSameAsCompanyAddress) {
      this.mailingAddress = this.companyAddress;
    }
  }
}
