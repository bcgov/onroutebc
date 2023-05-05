import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PermitApplicationOrigin } from 'src/common/enum/permit-application-origin.enum';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class UpdateApplicationDto {

  @AutoMap()
  @IsNumberString()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: '74',
    required: false,
  })
  companyId: string;

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
    enum: PermitStatus,
    description: 'Friendly name for the permit type.',
    example: ApplicationStatus.IN_PROGRESS,
  })
  permitStatus: PermitStatus;

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
