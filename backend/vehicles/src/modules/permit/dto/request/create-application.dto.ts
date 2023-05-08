import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PermitApplicationOrigin } from 'src/common/enum/permit-application-origin.enum';
import { PermitApprovalSource } from 'src/common/enum/permit-approval-source.enum';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class CreateApplicationDto {
  @AutoMap()
  @Allow()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'GUID of the user requesting the permit.',
    example: '06267945F2EB4E31B585932F78B76269',
    required: false,
  })
  userGuid: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'Friendly name for the permit type.',
    example: ApplicationStatus.IN_PROGRESS,
  })
  permitStatus: ApplicationStatus;

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
}
