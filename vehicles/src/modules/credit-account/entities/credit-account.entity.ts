import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
} from '../../../common/enum/credit-account-status-type.enum';
import { CreditAccountType } from '../../../common/enum/credit-account-type.enum';
import { Base } from '../../common/entities/base.entity';
import { Company } from '../../company-user-management/company/entities/company.entity';
import { CreditAccountActivity } from './credit-account-activity.entity';
import { CreditAccountUser } from './credit-account-user.entity';
import { Transaction } from '../../permit-application-payment/payment/entities/transaction.entity';
import { Nullable } from '../../../common/types/common';

@Entity({ name: 'permit.ORBC_CREDIT_ACCOUNT' })
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
  company: Company;

  /**
   * A property that specifies the status type of a credit account,
   * represented as an enumeration.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: CreditAccountStatus,
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
   * The column was made nullable to accomodate TPS migrated DATA
   */
  @AutoMap()
  @Column({ type: 'int', name: 'CFS_PARTY_NUMBER', nullable: true })
  cfsPartyNumber?: number;

  /**
   * The unique number associated with the credit account. Its the ORBC_CREDIT_ACCOUNT_NUMBER_SEQ prefixed with WS.
   */
  @AutoMap()
  @Column({ length: 12, name: 'CREDIT_ACCOUNT_NUMBER', nullable: false })
  creditAccountNumber: string;

  /**
   * Specifies whether the account is verified. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_VERIFIED',
    default: false,
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isVerified: boolean;

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
    { cascade: false },
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

  @AutoMap()
  @Column({
    type: 'decimal',
    precision: 9,
    scale: 2,
    name: 'EXTERNAL_ADJUSTMENT_AMT',
    nullable: true,
    insert: false,
    update: false,
  })
  externalAdjustmentAmount: number;

  @AutoMap()
  @OneToMany(() => Transaction, (transaction) => transaction.creditAccount, {
    cascade: false,
    eager: false,
  })
  public transactions?: Nullable<Transaction[]>;
}
