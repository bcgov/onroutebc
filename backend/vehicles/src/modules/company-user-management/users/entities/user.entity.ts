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
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_USER' })
export class User extends Base {
  /**
   *  A primary column representing the unique identifier for the user in ORBC.
   */
  @AutoMap()
  @PrimaryColumn({ length: 32, name: 'USER_GUID', nullable: false })
  userGUID: string;

  /**
   * The username of the user
   */
  @AutoMap()
  @Column({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

  /**
   * The type of directory the user belongs to in the system. It is an enum of
   * UserDirectory type.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserDirectory,
    length: 10,
    name: 'USER_DIRECTORY',
    nullable: false,
  })
  userDirectory: UserDirectory;

  /**
   * A property that represents the user's auth group in ORBC, which is an enum of type
   * {@link UserAuthGroup}.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserAuthGroup,
    length: 10,
    name: 'USER_AUTH_GROUP_ID',
    nullable: true,
  })
  userAuthGroup: UserAuthGroup;

  /**
   * The status of the user in the system. It is an enum of UserStatus type and
   * has a default value of 'ACTIVE'.
   */
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

  /**
   * A one-to-one relationship with the Contact entity, representing the contact
   * details of the user. It cascades on update or delete.
   */
  @AutoMap(() => Contact)
  @OneToOne(() => Contact, (Contact) => Contact.company, { cascade: true })
  @JoinColumn({ name: 'CONTACT_ID' })
  userContact: Contact;

  /**
   * A one-to-many relationship with the CompanyUser entity, representing the
   * list of companies the user belongs to. It cascades on update or delete.
   */
  @AutoMap(() => [CompanyUser])
  @OneToMany(() => CompanyUser, (CompanyUser) => CompanyUser.user, {
    cascade: true,
  })
  companyUsers: CompanyUser[];
}
