import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Company } from '../../company-user-management/company/entities/company.entity';
import { CreditAccountStatusType } from '../../../common/enum/credit-account-status-type.enum';
import { CreditAccountType } from '../../../common/enum/credit-account-type.enum';
import { CreditAccountActivity } from './credit-account-activity.entity';
import { CreditAccountUser } from './credit-account-user.entity';

@Entity({ name: 'ORBC_CREDIT_ACCOUNT' })
export class CreditAccount extends Base {
  /**
   * An auto-generated unique identifier for the credit account.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'CREDIT_ACCOUNT_ID' })
  creditAccountId: number;

  /**
   * The unique identifier of the company (Account Holder).
   */
  @AutoMap(() => Company)
  @OneToOne(() => Company, { nullable: false, cascade: false })
  @JoinColumn({ name: 'COMPANY_ID' })
  companyId: Company;

  /**
   * A property that specifies the status type of a credit account,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: CreditAccountStatusType,
    length: 10,
    name: 'CREDIT_ACCOUNT_STATUS_TYPE',
    nullable: false,
  })
  creditAccountStatusType: CreditAccountStatusType;

  /**
   * A property that specifies the type of a credit account,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: CreditAccountType,
    length: 10,
    name: 'CREDIT_ACCOUNT_TYPE',
    nullable: false,
    update: false,
  })
  creditAccountType: CreditAccountType;

  /**
   * A property that stores the CFS party number associated with the credit account.
   * It represents a unique identifier for the party within the CFS (Credit and Financial Services) system.
   */
  @AutoMap()
  @Column({ type: 'int', name: 'CFS_PARTY_NUMBER', nullable: false })
  cfsPartyNumber: number;

  /**
   * The unique number associated with the credit account. Its same as the onRouteBC Client number from ORBC_COMPANY
   */
  @AutoMap()
  @Column({ length: 13, name: 'CREDIT_ACCOUNT_NUMBER', nullable: false })
  creditAccountNumber: string;

  /**
   * A property that stores the CFS site number associated with the credit account.
   * It represents a unique identifier for the site within the CFS system.
   */
  @AutoMap()
  @Column({ type: 'int', name: 'CFS_SITE_NUMBER', nullable: true })
  cfsSiteNumber?: number;

  @OneToMany(
    () => CreditAccountActivity,
    (creditAccountActivity) => creditAccountActivity.creditAccount,
  )
  public creditAccountActivities: CreditAccountActivity[];

  /**
   * A one-to-many relationship with the CreditAccountUser entity, representing the
   * list of credit account users associated to the account.
   */
  @AutoMap(() => [CreditAccountUser])
  @OneToMany(
    () => CreditAccountUser,
    (creditAccountUser) => creditAccountUser.creditAccount,
    {
      cascade: false,
    },
  )
  creditAccountUsers?: CreditAccountUser[];
}
