import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { UserAuthGroup } from '../../../../common/enum/user-auth-group.enum';

@Entity({ name: 'ORBC_PENDING_IDIR_USER' })
export class PendingIdirUser extends Base {
  /**
   * A string property with a length of 50, representing the user name.
   */
  @AutoMap()
  @PrimaryColumn({ length: 50, name: 'USERNAME', nullable: false })
  userName: string;

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
