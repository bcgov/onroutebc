import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JSON representation of a physical address
 */
export class CreateAddressDto {
  @AutoMap()
  @ApiProperty({
    example: '1234 Main St.',
    description:
      'The first segment of the address (commonly known as Address Line 1)',
    required: true,
  })
  addressLine1: string;

  @AutoMap()
  @ApiProperty({
    example: 'Unit 321',
    description:
      'An additional segment of the address (if address line 1 is insufficient)',
    required: false,
    format: 'Alphanumeric',
  })
  addressLine2: string;

  @AutoMap()
  @ApiProperty({
    example: 'Vancouver',
    description: 'City',
    required: true,
    format: 'Alphabetic',
  })
  city: string;

  @AutoMap()
  @ApiProperty({
    example: 'BC',
    description:
      'A 2-character string indicating the province. ' +
      'Required if the countryCode is either CA or US.',
    required: false,
  })
  provinceCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'A 2-character string indicating the country.',
    required: true,
  })
  countryCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'V8W2E7',
    description: 'Postal/zip code - 5 characters if US, 6 characters if CA.',
    required: true,
  })
  postalCode: string;
}
