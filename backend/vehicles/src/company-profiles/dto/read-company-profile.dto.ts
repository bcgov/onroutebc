import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { ContactDto } from './contact.dto';

/**
 * JSON representation for request object to create a company profile.
 */
export class ReadCompanyProfileDto {
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
  companyLegalName: string;

  @AutoMap()
  @ApiProperty({
    description: 'The business GUID.',
    example: 'XYZ12345',
  })
  bizGUID: string;

  @AutoMap()
  @ApiProperty({
    description: 'The physical address of the company.',
    required: true,
  })
  companyAddress: AddressDto;

  @AutoMap()
  @ApiProperty({
    description:
      'The mailing address of the company. ' +
      'If given, the object must adhere to the individual field rules',
    required: false,
  })
  mailingAddress: AddressDto;

  @AutoMap()
  @ApiProperty({
    description:
      'Boolean field indicating if the mailing address is same as company address.',
    required: true,
  })
  companyAddressSameAsMailingAddress: boolean;

  @AutoMap()
  @ApiProperty({
    description: 'The email address of the company.',
    required: true,
  })
  companyEmail: string;

  @AutoMap()
  @ApiProperty({
    description: 'The phone number of the company.',
    required: true,
    maxLength: 20,
    minLength: 10,
  })
  companyPhone: string;

  @AutoMap()
  @ApiProperty({
    description: 'The phone extension of the company (if there is one).',
    required: false,
    maxLength: 5,
  })
  companyExtensionNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The fax number of the company (if there is one).',
    required: false,
    maxLength: 20,
    minLength: 10,
  })
  companyFaxNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The primary contact of the company.',
    required: true,
    type: ContactDto,
  })
  primaryContact: ContactDto;
}
