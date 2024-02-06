import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PermitApplicationOrigin } from 'src/common/enum/permit-application-origin.enum';
import { PermitStatus } from 'src/common/enum/permit-status.enum';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class UpdateApplicationDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'GUID of the user requesting the permit.',
    example: '06267945F2EB4E31B585932F78B76269',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  userGuid: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  @IsOptional()
  @IsEnum(PermitType)
  permitType: PermitType;

  //ToDo: remove PermitStatus, update application should not change PermitStatus. there is an existing endpoint to change status.
  @AutoMap()
  @ApiProperty({
    enum: PermitStatus,
    description: 'Friendly name for the permit type.',
    required: false,
    example: ApplicationStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(PermitStatus)
  permitStatus: PermitStatus;

  //ToDo: remove permitApplicationOrigin, update application should not change permitApplicationOrigin
  @AutoMap()
  @ApiProperty({
    enum: PermitApplicationOrigin,
    example: PermitApplicationOrigin.ONLINE,
    required: false,
    description: 'Unique identifier for the application origin.',
  })
  @IsOptional()
  @IsEnum(PermitApplicationOrigin)
  permitApplicationOrigin: PermitApplicationOrigin;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Application JSON.',
  })
  @Allow()
  permitData: JSON;

  @AutoMap()
  @ApiProperty({
    description: 'Amendment reason or comment.',
    example: 'This application was amended because of so-and-so reason.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  comment: string;
}
