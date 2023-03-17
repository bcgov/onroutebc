import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * JSON representation of a contact
 */
export class CreateContactDto {
  @AutoMap()
  @ApiProperty({
    example: 'Adam',
    description: 'The first name of the contact.',
    required: true,
  })
  firstName: string;

  @AutoMap()
  @ApiProperty({
    example: 'Smith',
    description: 'The last name of the contact.',
    required: true,
  })
  lastName: string;

  @AutoMap()
  @ApiProperty({
    example: '9999999999',
    description:
      'The primary phone number of the contact (including country code).',
    required: true,
    format: 'Numeric',
    maxLength: 20,
    minLength: 10,
  })
  phone1: string;

  @AutoMap()
  @ApiProperty({
    example: '99999',
    description: 'The extension of the primary phone number (if one exists).',
    required: false,
    maxLength: 5,
    format: 'Numeric',
  })
  phone1Extension: string;

  @AutoMap()
  @ApiProperty({
    example: '9999999999',
    description: 'A secondary phone number of the contact.',
    required: false,
    format: 'Numeric',
    maxLength: 20,
    minLength: 10,
  })
  phone2: string;

  @AutoMap()
  @ApiProperty({
    example: '99999',
    description: 'The extension of the secondary phone number (if one exists).',
    required: false,
    format: 'Numeric',
    maxLength: 5,
  })
  phone2Extension: string;

  @AutoMap()
  @ApiProperty({
    description: 'The fax number of the contact (if there is one).',
    required: false,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  fax?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The email address of the contact.',
    required: true,
    example: 'test@test.gov.bc.ca',
  })
  @IsEmail()
  email: string;

  @AutoMap()
  @ApiProperty({
    example: 'Vancouver',
    description: 'The city of the contact',
    required: true,
    format: 'Alphabetic',
  })
  city: string;

  @AutoMap()
  @ApiProperty({
    description:
      'A 5-character string indicating the province/state.' +
      'It is a combination of CountryCode and ProvinceCode joined with a hyphen, eg CA-BC',
    example: 'CA-BC',
    required: true,
  })
  provinceId: string;
}
