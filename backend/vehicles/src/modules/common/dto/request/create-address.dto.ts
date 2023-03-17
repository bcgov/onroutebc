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
    description:
      'A 5-character string indicating the province/state.' +
      'It is a combination of CountryCode and ProvinceCode joined with a hyphen, eg CA-BC',
    example: 'CA-BC',
    required: true,
  })
  provinceId: string;

  @AutoMap()
  @ApiProperty({
    example: 'V8W2E7',
    description: 'Postal/zip code - 5 characters if US, 6 characters if CA.',
    required: true,
  })
  postalCode: string;
}
