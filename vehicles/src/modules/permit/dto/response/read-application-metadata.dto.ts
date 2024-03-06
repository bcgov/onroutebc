import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PermitApplicationOrigin } from 'src/common/enum/permit-application-origin.enum';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class ReadApplicationMetadataDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the Application.',
    example: 74,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the Application.',
    example: '',
  })
  permitId: string;

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
    description: 'Satus of Permit/Permit Application',
    example: ApplicationStatus.IN_PROGRESS,
    required: false,
  })
  permitStatus: ApplicationStatus;

  @AutoMap()
  @ApiProperty({
    enum: PermitApplicationOrigin,
    example: PermitApplicationOrigin.ONLINE,
    description: 'Unique identifier for the application origin.',
  })
  permitApplicationOrigin: PermitApplicationOrigin;

  @AutoMap()
  @ApiProperty({
    description: 'Permit start Date and Time.',
  })
  startDate: string;

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
    description: 'Name of the user who started the application',
    example: 'John Smith',
  })
  applicant: string;

  @AutoMap()
  @ApiProperty({
    description: 'Name of the unit associated with the application',
    example: 'Unit 42',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description:
      'Vehicle Identification Number associated with the application',
    example: '275393',
  })
  vin: string;

  @AutoMap()
  @ApiProperty({
    description: 'License plate number associated with the application vehicle',
    example: 'PRJZZP',
  })
  plate: string;
}
