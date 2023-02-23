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
import { Contact } from '../../../common/entities/contact.entity';
import { CompanyUser } from './company-user.entity';
import { UserDirectory } from '../../../../common/enum/directory.enum';
import { UserStatus } from '../../../../common/enum/user-status.enum';

@Entity({ name: 'ORBC_USER' })
export class User extends Base {
  @AutoMap()
  @PrimaryColumn({ length: 32, name: 'USER_GUID', nullable: false })
  userGUID: string;

  @AutoMap()
  @Column({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserDirectory,
    length: 10,
    name: 'USER_DIRECTORY',
    nullable: false,
  })
  userDirectory: UserDirectory;

  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserStatus,
    length: 10,
    name: 'STATUS_CODE',
    default: 'ACTIVE',
    nullable: false,
  })
  statusCode: UserStatus;

  @AutoMap(() => Contact)
  @OneToOne(() => Contact, (Contact) => Contact.company, { cascade: true })
  @JoinColumn({ name: 'CONTACT_ID' })
  userContact: Contact;

  @AutoMap(() => [CompanyUser])
  @OneToMany(() => CompanyUser, (CompanyUser) => CompanyUser.user, {
    cascade: true,
  })
  companyUsers: CompanyUser[];
}
