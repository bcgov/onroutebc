import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ORBC_CREDIT_ACCOUNT', schema: 'permit' })
export class CreditAccount {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the credit account metadata.',
  })
  @PrimaryGeneratedColumn({ name: 'CREDIT_ACCOUNT_ID' })
  creditAccountId: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit.',
  })
  @Column({ type: 'integer', name: 'COMPANY_ID', nullable: true })
  companyId: number;

  @Column({
    name: 'CREDIT_ACCOUNT_STATUS_TYPE',
    type: 'nvarchar',
    length: 10,
    nullable: false,
  })
  creditAccountStatusType: string;

  @Column({
    name: 'CREDIT_ACCOUNT_TYPE',
    type: 'nvarchar',
    length: 10,
    nullable: false,
  })
  creditAccountType: string;

  @Column({ name: 'CFS_PARTY_NUMBER', type: 'int', nullable: true })
  cfsPartyNumber: number;

  @Column({
    name: 'CREDIT_ACCOUNT_NUMBER',
    type: 'nvarchar',
    length: 6,
    nullable: false,
  })
  creditAccountNumber: string;

  @Column({ name: 'CFS_SITE_NUMBER', type: 'int', nullable: true })
  cfsSiteNumber?: number;
}
