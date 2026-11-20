import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Base } from '@modules/common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { PendingIdirUser } from '@modules/company-user-management/pending-idir-users/entities/pending-idir-user.entity';
import { UserManagementActivityType } from '@common/enum/user-management-activity-type.enum';
import { IDIRUserRole } from '@common/enum/user-role.enum';
import { User } from '@modules/company-user-management/users/entities/user.entity';

@Entity({ name: 'ORBC_USER_MANAGEMENT_ACTIVITY' })
export class UserManagementActivity extends Base {
  /**
   * An auto-generated unique identifier for the user management activity.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ACTIVITY_ID' })
  activityId: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.userManagementActivities, {
    nullable: true,
    cascade: false,
  })
  @JoinColumn({ name: 'USER_GUID' })
  user?: User;

  @AutoMap(() => PendingIdirUser)
  @ManyToOne(
    () => PendingIdirUser,
    (pendingUser) => pendingUser.userManagementActivities,
    { nullable: true, cascade: false },
  )
  @JoinColumn({ name: 'PENDING_USERNAME' })
  pendingStaffUser?: PendingIdirUser;

  @AutoMap(() => User)
  @ManyToOne(() => User, {
    nullable: true,
    cascade: false,
  })
  @JoinColumn({ name: 'UPDATED_BY_IDIR_USER_GUID' })
  updatedByStaffUser?: User;

  /**
   * A property that represents the user's role in ORBC.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: IDIRUserRole,
    length: 15,
    name: 'ASSIGNED_USER_AUTH_GROUP_TYPE',
    nullable: true,
  })
  assignedUserRole: IDIRUserRole;

  /**
   * The date and time when the user management activity occurred.
   */
  @AutoMap()
  @Column({
    name: 'DATE',
    nullable: false,
  })
  userManagementActivityDateTime: Date;

  /**
   * A property that specifies the activity type performed on a user account,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: UserManagementActivityType,
    length: 15,
    name: 'USER_MANAGEMENT_ACTIVITY_TYPE',
    nullable: false,
  })
  userManagementActivityType: UserManagementActivityType;

  /**
   * A field to store optional comments related to the user management activity. This can include any contextual information or reason for the activity. Allows up to 4000 characters.
   */
  @AutoMap()
  @Column({ length: 4000, name: 'COMMENTS', nullable: true })
  comment?: string;
}
