import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { User } from '../../company-user-management/users/entities/user.entity';
import { CreditAccountActivityType } from '../../../common/enum/credit-account-activity-type.enum';
import { CreditAccount } from './credit-account.entity';

@Entity({ name: 'permit.ORBC_CREDIT_ACCOUNT_ACTIVITY' })
export class CreditAccountActivity extends Base {
  /**
   * An auto-generated unique identifier for the credit account activity.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ACTIVITY_ID' })
  activityId: number;

  @AutoMap(() => CreditAccount)
  @ManyToOne(
    () => CreditAccount,
    (creditAccount) => creditAccount.creditAccountActivities,
  )
  @JoinColumn({ name: 'CREDIT_ACCOUNT_ID' })
  creditAccount: CreditAccount;

  /**
   * The User entity linked to credit account activity.
   */
  @AutoMap(() => User)
  @OneToOne(() => User, { nullable: true, cascade: false })
  @JoinColumn({ name: 'IDIR_USER_GUID' })
  idirUser?: User;

  /**
   * The date and time when the credit account activity occurred.
   */
  @AutoMap()
  @Column({
    name: 'DATE',
    nullable: false,
  })
  creditAccountActivityDateTime: Date;

  /**
   * A property that specifies the activity type performed on a credit account,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: CreditAccountActivityType,
    length: 10,
    name: 'CREDIT_ACCOUNT_ACTIVITY_TYPE',
    nullable: false,
  })
  creditAccountActivityType: CreditAccountActivityType;

  /**
   * A field to store optional comments related to the credit account activity. This can include any contextual information or reason for the activity. Allows up to 4000 characters.
   */
  @AutoMap()
  @Column({ length: 4000, name: 'COMMENTS', nullable: true })
  comment?: string;
}
