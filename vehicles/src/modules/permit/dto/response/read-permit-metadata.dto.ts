import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PermitType } from '../../../../common/enum/permit-type.enum';
import { PermitApprovalSource } from '../../../../common/enum/permit-approval-source.enum';
import { PermitApplicationOrigin } from '../../../../common/enum/permit-application-origin.enum';
import { PermitStatus } from 'src/common/enum/permit-status.enum';

export class ReadPermitMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the Permit.',
    example: 74,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the Permit.',
    example: '1',
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
    enum: PermitType,
    description: 'The Permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description: 'Unique formatted permit number.',
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Status of the Permit',
    example: PermitStatus.ISSUED,
    required: false,
  })
  permitStatus: PermitStatus;

  @AutoMap()
  @ApiProperty({
    enum: PermitApprovalSource,
    example: PermitApprovalSource.PPC,
    description: 'Source of approval for the permit.',
  })
  permitApprovalSource: PermitApprovalSource;

  @AutoMap()
  @ApiProperty({
    enum: PermitApplicationOrigin,
    example: PermitApplicationOrigin.ONLINE,
    description:
      'Specifies the source from which the permit application was submitted.',
  })
  permitApplicationOrigin: PermitApplicationOrigin;

  @AutoMap()
  @ApiProperty({
    description: 'Permit start Date and Time.',
  })
  startDate: string;

  @AutoMap()
  @ApiProperty({
    description: 'Permit issue Date and Time.',
  })
  permitIssueDateTime: string;

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
    description: 'Name of the user who started the permit application',
    example: 'John Smith',
  })
  applicant: string;

  @AutoMap()
  @ApiProperty({
    description: 'Name of the user who issued the permit',
    example: 'John Smith',
    required: false,
  })
  issuer: string;

  @AutoMap()
  @ApiProperty({
    description: 'Name of the unit associated with the permit',
    example: 'Unit 42',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Vehicle Identification Number associated with the permit',
    example: '275393',
  })
  vin: string;

  @AutoMap()
  @ApiProperty({
    description: 'License plate number associated with the permit vehicle',
    example: 'PRJZZP',
  })
  plate: string;
}
