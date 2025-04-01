import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from './base.entity';
import { CreditAccount } from './credit-account.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'ORBC_COMPANY' })
export class Company extends Base {
  /**
   * An auto-generated unique identifier for the company.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'COMPANY_ID' })
  companyId: number;

  /**
   * The company's GUID.
   */
  @AutoMap()
  @Column({ length: 32, name: 'COMPANY_GUID', nullable: true })
  companyGUID: string;

  /**
   * The ORBC client number of the company.
   */
  @AutoMap()
  @Column({ length: 13, name: 'CLIENT_NUMBER', nullable: true })
  clientNumber: string;

  /**
   * The migrated client number of the company encoded SHA-256.
   */
  @AutoMap()
  @Column({
    length: 64,
    name: 'TPS_CLIENT_HASH',
    nullable: true,
    insert: false,
    update: false,
  })
  migratedClientHash?: string;

  /**
   * The company's legal name.
   */
  @AutoMap()
  @Column({ length: 100, name: 'LEGAL_NAME', nullable: false })
  legalName: string;

  /**
   * The company's Alternate name/DBA.
   */
  @AutoMap()
  @Column({ length: 150, name: 'ALTERNATE_NAME', nullable: true })
  alternateName?: string;

  /**
   * The company's phone number.
   */
  @AutoMap()
  @Column({ length: 20, name: 'PHONE', nullable: false })
  phone: string;

  /**
   * The company's phone extension.
   */
  @AutoMap()
  @Column({ length: 5, name: 'EXTENSION', nullable: false })
  extension: string;

  /**
   * The company's email address.
   */
  @AutoMap()
  @Column({ length: 100, name: 'EMAIL', nullable: false })
  email: string;

  /**
   * Specifies whether the account is suspended. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_SUSPENDED',
    default: false,
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isSuspended: boolean;

    @AutoMap()
    @ApiProperty({
      example: '74',
      description:
        'Foreign key to the ORBC_CCREDIT_ACCOUNT table, represents the credit account requesting the permit.',
    })
    @ManyToOne(() => CreditAccount, { eager: true, cascade: false })
    @JoinColumn({ name: 'COMPANY_ID' })
    creditAccount: CreditAccount;
}
