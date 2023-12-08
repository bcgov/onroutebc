import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_PENDING_USER' })
export class PendingUser extends Base {
  /**
   * A number property, representing the company's ID.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'PENDING_USER_ID' })
  pendingUserId: number;

  /**
   * A number property, representing the company's ID.
   */
  @AutoMap()
  @Column({ type: 'int', name: 'COMPANY_ID', nullable: false })
  companyId: number;

  /**
   * A string property with a length of 50, representing the user name.
   */
  @AutoMap()
  @Column({ length: 50, name: 'USERNAME', nullable: true })
  userName: string;

  /**
   *  A string property with a length of 32, representing the user guid.
   */
  @AutoMap()
  @Column({ length: 32, name: 'USER_GUID', nullable: false })
  userGUID?: string;

  /**
   * A property that represents the user's auth group, which is an enum of
   * type {@link UserAuthGroup}.
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
