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
    example: '1',
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'The Permit Type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    example: 'A2-00000002-120',
    description: 'Unique formatted application number.',
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Status of Permit Application.',
    example: ApplicationStatus.IN_PROGRESS,
    required: false,
  })
  permitStatus: ApplicationStatus;

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
    description: 'Permit expiry Date and Time.',
  })
  expiryDate: string;

  @AutoMap()
  @ApiProperty({
    description: 'Application created Date and Time.',
  })
  createdDateTime: string;

  @AutoMap()
  @ApiProperty({
    description: 'Application updated Date and Time.',
  })
  updatedDateTime: string;

  @AutoMap()
  @ApiProperty({
    description:
      'The first name and last name of the logged in user that started the permit application or Provincial Permit Center if started by staff',
    example: 'John Smith',
  })
  applicant: string;

  @AutoMap()
  @ApiProperty({
    description: 'Name of the unit associated with the application.',
    example: 'Unit 42',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description:
      'Vehicle Identification Number associated with the application.',
    example: '275393',
  })
  vin: string;

  @AutoMap()
  @ApiProperty({
    description:
      'License plate number associated with the application vehicle.',
    example: 'PRJZZP',
  })
  plate: string;
}
