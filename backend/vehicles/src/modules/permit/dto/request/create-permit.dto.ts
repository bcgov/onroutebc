import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PermitType } from '../../../../common/enum/permit-type.enum';
import { PermitApprovalSource } from '../../../../common/enum/permit-approval-source.enum';
import { PermitApplicationOrigin } from '../../../../common/enum/permit-application-origin.enum';
import { IsNumber } from 'class-validator';

export class CreatePermitDto {
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
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  permitType: PermitType;

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
