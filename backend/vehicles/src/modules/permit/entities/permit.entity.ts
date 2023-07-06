import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { PermitType } from '../../../common/enum/permit-type.enum';
import { PermitData } from './permit-data.entity';
import { PermitApplicationOrigin } from '../../../common/enum/permit-application-origin.enum';
import { PermitApprovalSource } from '../../../common/enum/permit-approval-source.enum';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { Transaction } from 'src/modules/payment/entities/transaction.entity';

@Entity({ name: 'permit.ORBC_PERMIT' })
export class Permit extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  permitId: string;

  @AutoMap(() => PermitData)
  @OneToOne(() => PermitData, (PermitData) => PermitData.permit, {
    cascade: true,
  })
  permitData: PermitData;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Foreign key to the ORBC_COMPANY table, represents the company requesting the permit.',
  })
  @Column({ type: 'integer', name: 'COMPANY_ID', nullable: true })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the revision number for a permit.',
  })
  @Column({ type: 'integer', name: 'REVISION', nullable: true })
  revision: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the previous permit id for a revised permit.',
  })
  @Column({ type: 'integer', name: 'PREVIOUS_REV_ID', nullable: true })
  previousRevision: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'GUID of the user requesting the permit.',
  })
  @Column({ length: 32, name: 'OWNER_USER_GUID', nullable: true })
  userGuid: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type',
    example: PermitType.TERM_OVERSIZE,
  })
  @Column({
    type: 'simple-enum',
    enum: PermitType,
    length: 10,
    name: 'PERMIT_TYPE_ID',
    nullable: true,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    enum: PermitApprovalSource,
    example: PermitApprovalSource.PPC,
    description: 'Unique identifier for the application approval source',
  })
  @Column({
    type: 'simple-enum',
    enum: PermitApprovalSource,
    length: 8,
    name: 'PERMIT_APPROVAL_SOURCE_ID',
    nullable: true,
  })
  permitApprovalSource: PermitApprovalSource;

  @AutoMap()
  @ApiProperty({
    enum: PermitApplicationOrigin,
    example: PermitApplicationOrigin.ONLINE,
    description: 'Unique identifier for the application origin',
  })
  @Column({
    type: 'simple-enum',
    enum: PermitApplicationOrigin,
    length: 8,
    name: 'APPLICATION_ORIGIN_ID',
    nullable: true,
  })
  permitApplicationOrigin: PermitApplicationOrigin;

  @AutoMap()
  @ApiProperty({
    example: 'A2-00000002-120',
    description: 'Unique formatted permit application number.',
  })
  @Column({
    length: '19',
    name: 'APPLICATION_NUMBER',
    nullable: true,
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description:
      'Unique formatted permit number, recorded once the permit is approved and issued.',
  })
  @Column({
    length: '19',
    name: 'PERMIT_NUMBER',
    nullable: true,
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    example: ApplicationStatus.IN_PROGRESS,
    description:
      'State of a permit or permit application, at any given point in time',
  })
  @Column({
    length: 20,
    name: 'PERMIT_STATUS_ID',
    nullable: true,
  })
  permitStatus: ApplicationStatus;

  @AutoMap()
  @ApiProperty({
    description: 'DMS Document ID used to retrieve the PDF of the permit',
  })
  @Column({
    name: 'DOCUMENT_ID',
    nullable: true,
  })
  documentId: string;

  @ManyToMany(
    () => Transaction,
    transaction => transaction.permits,
  )
  transactions?: Transaction[];
}
