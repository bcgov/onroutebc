import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PermitApplicationOrigin } from 'src/common/enum/permit-application-origin.enum';
import { PermitApprovalSource } from 'src/common/enum/permit-approval-source.enum';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class CreateApplicationDto {
  @AutoMap()
  @IsNumber()
  @ApiProperty({
    description: 'Id of the company requesting the permit.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the permit.',
    example: '',
    required: false,
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: 'A2-00000002-120',
    description: 'Unique formatted permit application number.',
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the old permit.',
    example: '',
    required: false,
  })
  previousRevision: string;

  @AutoMap()
  @ApiProperty({
    description: 'Revision number for permit',
    example: '',
    required: false,
  })
  revision: number;

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
    example: {
      startDate: '2023-06-05T19:12:22Z',
      expiryDate: '2023-07-04T19:12:22Z',
      permitDuration: 30,
      feeSummary: '30',
      commodities: [
        {
          description: 'General Permit Conditions',
          condition: 'CVSE-1000',
          conditionLink:
            'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251',
          checked: true,
        },
        {
          description: 'Permit Scope and Limitation',
          condition: 'CVSE-1070',
          conditionLink:
            'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261',
          checked: true,
        },
        {
          description: 'Log Permit Conditions',
          condition: 'CVSE-1000L',
          conditionLink:
            'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1250',
          checked: true,
        },
      ],
      contactDetails: {
        firstName: 'Lewis',
        lastName: 'Hamilton',
        phone1: '(778) 952-1234',
        email: 'lewis@f1.com',
        phone1Extension: '1',
        phone2: null,
        phone2Extension: null,
        fax: null,
      },
      mailingAddress: {
        addressLine1: '123 Short Street',
        addressLine2: null,
        city: 'Victoria',
        provinceCode: 'BC',
        countryCode: 'CA',
        postalCode: 'V8X2V5',
      },
      vehicleDetails: {
        vin: '781452',
        plate: 'PRJZZP',
        make: 'GMC',
        year: 2001,
        countryCode: 'CA',
        provinceCode: 'BC',
        vehicleType: 'powerUnit',
        vehicleSubType: 'LOGGING',
        saveVehicle: true,
      },
    },
  })
  permitData: JSON;
}
