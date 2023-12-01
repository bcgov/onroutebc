import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ReadAddressDto } from '../../../../common/dto/response/read-address.dto';
import { ReadContactDto } from '../../../../common/dto/response/read-contact.dto';

/**
 * JSON representation of response object when retrieving a company.
 */
export class ReadCompanyDto {
  @AutoMap()
  @ApiProperty({
    description: 'The company ID.',
    example: 1,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The company GUID.',
    example: '6F9619FF8B86D011B42D00C04FC964FF',
  })
  companyGUID: string;

  @AutoMap()
  @ApiProperty({
    description: 'The ORBC client number.',
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
    description: 'The Alternate name of the company/Doing Business As (DBA).',
    example: 'ABC Carriers Inc.',
  })
  alternateName?: string;

  @AutoMap()
  @ApiProperty({
    description:
      'The mailing address of the company. ' +
      'The object must adhere to the individual field rules',
    required: true,
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
  extension?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The fax number of the company (if there is one).',
    required: false,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  fax?: string;

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
