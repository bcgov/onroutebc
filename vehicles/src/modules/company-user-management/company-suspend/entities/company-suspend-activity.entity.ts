import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { Base } from '../../../common/entities/base.entity';
import { SuspendActivity } from '../../../../common/enum/suspend-activity.enum';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'ORBC_COMPANY_SUSPEND_ACTIVITY' })
export class CompanySuspendActivity extends Base {
  /**
   * An auto-generated unique identifier for the suspend activity.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ACTIVITY_ID' })
  activityId: number;

  /**
   * The unique identifier of the company. This property is not linked to the `Company` entity because there is no current requirement for such a linkage. Foreign key constraints are applied directly in the database.
   */
  @AutoMap()
  @Column({ type: 'int', name: 'COMPANY_ID', nullable: false })
  companyId: number;

  /**
   * A field to store optional comments related to the suspend activity. This can include any contextual information or reason for suspension. Allows up to 4000 characters.
   */
  @AutoMap()
  @Column({ length: 4000, name: 'COMMENTS', nullable: true })
  comment?: string;
  /**
   * The User entity linked to company's suspend activity.
   */
  @AutoMap(() => User)
  @OneToOne(() => User, { nullable: false, cascade: false })
  @JoinColumn({ name: 'IDIR_USER_GUID' })
  idirUser: User;

  /**
   * The date and time when the company's activity was suspended.
   */
  @AutoMap()
  @Column({
    name: 'DATE',
    nullable: false,
  })
  suspendActivityDateTime: Date;

  /**
   * A property that specifies the type of suspend activity for a company,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: SuspendActivity,
    length: 10,
    name: 'SUSPEND_ACTIVITY_TYPE',
    nullable: false,
    update: false,
  })
  suspendActivityType: SuspendActivity;
}
