import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateAddressDto } from '../../../../common/dto/request/update-address.dto';
import { UpdateContactDto } from '../../../../common/dto/request/update-contact.dto';

/**
 * JSON representation of request object for updating a company.
 */
export class UpdateCompanyDto {
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
  companyAddress: UpdateAddressDto;

  @AutoMap()
  @ApiProperty({
    description:
      'A boolean field that indicates whether the mailing address of the company is the same as the physical address of the company.',
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
  mailingAddress: UpdateAddressDto;

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
  primaryContact: UpdateContactDto;
}
