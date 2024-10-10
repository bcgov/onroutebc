import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { Company } from '../../company-user-management/company/entities/company.entity';
import { CreditAccount } from './credit-account.entity';

@Entity({ name: 'permit.ORBC_CREDIT_ACCOUNT_USER' })
export class CreditAccountUser extends Base {
  /**
   * An auto-generated unique identifier for the credit account.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'CREDIT_ACCOUNT_USER_ID' })
  creditAccountUserId: number;

  /**
   * A many-to-one relationship with the Company entity, which represents the
   * company that is associated to the credit account.
   */
  @AutoMap(() => Company)
  @ManyToOne(() => Company, { cascade: false, nullable: false })
  @JoinColumn({ name: 'COMPANY_ID' })
  public company: Company;

  /**
   *  A many-to-one relationship with the CreditAccount entity, which represents the credit account
   *  that this credit account user belongs to.
   */
  @AutoMap(() => CreditAccount)
  @ManyToOne(
    () => CreditAccount,
    (creditAccount) => creditAccount.creditAccountUsers,
    { cascade: false, nullable: false },
  )
  @JoinColumn({ name: 'CREDIT_ACCOUNT_ID' })
  public creditAccount: CreditAccount;

  /**
   * Specifies whether the relation between the credit account user and credit account is active. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_ACTIVE',
    default: false,
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isActive: boolean;
}
