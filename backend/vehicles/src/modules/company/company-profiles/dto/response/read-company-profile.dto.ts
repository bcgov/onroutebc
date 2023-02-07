import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadAddressDto } from '../../../../common/dto/response/read-address.dto';
import { ReadContactDto } from '../../../../common/dto/response/read-contact.dto';

/**
 * JSON representation for request object to create a company profile.
 */
export class ReadCompanyProfileDto {
  @AutoMap()
  @ApiProperty({
    description: 'The business GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
  })
  companyGUID: string;

  @AutoMap()
  @ApiProperty({
    description: 'The BCeID client number.',
    example: '1234',
  })
  clientNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The legal name of the company.',
    example: 'ABC Carriers Inc.',
  })
  legalName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The physical address of the company.',
    required: true,
  })
  companyAddress: ReadAddressDto;

  @AutoMap()
  @ApiProperty({
    description:
      'Boolean field indicating if the mailing address is same as company address.',
    required: true,
  })
  mailingAddressSameAsCompanyAddress: boolean;

  @AutoMap()
  @ApiProperty({
    description:
      'The mailing address of the company. ' +
      'If given, the object must adhere to the individual field rules',
    required: false,
  })
  mailingAddress: ReadAddressDto;

  @AutoMap()
  @ApiProperty({
    description: 'The phone number of the company.',
    required: true,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  phone: string;

  @AutoMap()
  @ApiProperty({
    description: 'The phone extension of the company (if there is one).',
    required: false,
    maxLength: 5,
    example: '99999',
  })
  extension: string;

  @AutoMap()
  @ApiProperty({
    description: 'The fax number of the company (if there is one).',
    required: false,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  fax: string;

  @AutoMap()
  @ApiProperty({
    description: 'The email address of the company.',
    required: true,
    example: 'test@test.gov.bc.ca',
  })
  email: string;

  @AutoMap()
  @ApiProperty({
    description: 'The primary contact of the company.',
    required: true,
  })
  primaryContact: ReadContactDto;
}
