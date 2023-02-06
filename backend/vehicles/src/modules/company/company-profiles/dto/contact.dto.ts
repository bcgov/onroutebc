import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../common/dto/base.dto';
import { IsEmail } from 'class-validator';

/**
 * JSON representation of a contact
 */
export class ContactDto extends BaseDto {
  @AutoMap()
  @ApiProperty({
    example: '55542',
    description: 'The contact id. Required for an update operation.',
    required: false,
  })
  contactId: string;

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
    example: '123',
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
    example: '123',
    description: 'The extension of the secondary phone number (if one exists).',
    required: false,
    format: 'Numeric',
    maxLength: 5,
  })
  phone2Extension: string;

  @AutoMap()
  @ApiProperty({
    description: 'The email address of the contact.',
    required: true,
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
    example: 'BC',
    description: 'A 2-character string indicating the province/state',
    required: false,
  })
  province: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'A 2-character string indicating the country',
    required: false,
  })
  country: string;
}
