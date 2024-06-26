import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PermitType } from '../../../../../common/enum/permit-type.enum';
import { PermitApprovalSource } from '../../../../../common/enum/permit-approval-source.enum';
import { PermitApplicationOrigin } from '../../../../../common/enum/permit-application-origin.enum';
import { PermitStatus } from 'src/common/enum/permit-status.enum';

export class ReadPermitDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the permit.',
    example: 74,
    required: false,
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Id of the original permit for a revision',
  })
  originalPermitId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Revision number for a permit.',
  })
  revision: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Previous permit id for a revised permit.',
  })
  previousRevision: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was amended because of so-and-so reason',
    description: 'Comment/Reason for modifying a permit.',
  })
  comment: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    example: 'A2-00000002-120',
    description: 'Unique formatted permit application number.',
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description:
      'Unique formatted permit number, recorded once the permit is approved and issued.',
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Status of Permit/Permit Application',
    example: PermitStatus.ISSUED,
    required: false,
  })
  permitStatus: PermitStatus;

  @AutoMap()
  @ApiProperty({
    enum: PermitApprovalSource,
    example: PermitApprovalSource.PPC,
    description: 'Unique identifier for the application approval source.',
  })
  permitApprovalSource: PermitApprovalSource;

  @AutoMap()
  @ApiProperty({
    enum: PermitApplicationOrigin,
    example: PermitApplicationOrigin.ONLINE,
    description: 'Unique identifier for the application origin.',
  })
  permitApplicationOrigin: PermitApplicationOrigin;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Application JSON.',
  })
  permitData: JSON;

  @AutoMap()
  @ApiProperty({
    description: 'Permit issue Date and Time.',
  })
  permitIssueDateTime: Date;

  @AutoMap()
  @ApiProperty({
    description: 'Permit created Date and Time.',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Permit updated Date and Time.',
  })
  updatedDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Permit document ID.',
  })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Name of the user who issued the permit',
    example: 'John Smith',
    required: false,
  })
  issuer: string;
}
