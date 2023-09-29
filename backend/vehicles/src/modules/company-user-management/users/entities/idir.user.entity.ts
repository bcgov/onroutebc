import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';

import { UserStatus } from '../../../../common/enum/user-status.enum';
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_IDIR_USER' })
export class IdirUser extends Base {
  /**
   *  A primary column representing the unique identifier for the user in ORBC.
   */
  @AutoMap()
  @PrimaryColumn({
    length: 32,
    name: 'USER_GUID',
    nullable: false,
    update: false,
  })
  userGUID: string;

  /**
   * The username of the user
   */
  @AutoMap()
  @Column({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

  /**
   * First name of the contact person.
   */
  @AutoMap()
  @Column({ length: 100, name: 'FIRST_NAME', nullable: false })
  firstName: string;

  /**
   * Last name of the contact person.
   */
  @AutoMap()
  @Column({ length: 100, name: 'LAST_NAME', nullable: false })
  lastName: string;

  /**
   * Email address of the contact person.
   */
  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: false })
  email: string;

  /**
   * The status of the user in the system. It is an enum of UserStatus type and
   * has a default value of 'ACTIVE'.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserStatus,
    length: 10,
    name: 'USER_STATUS_TYPE',
    default: UserStatus.ACTIVE,
    nullable: false,
  })
  statusCode: UserStatus;

  /**
   * A property that represents the user's auth group in ORBC, which is an enum of type
   * {@link UserAuthGroup}.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserAuthGroup,
    length: 10,
    name: 'USER_AUTH_GROUP_TYPE',
    nullable: false,
  })
  userAuthGroup: UserAuthGroup;
}
