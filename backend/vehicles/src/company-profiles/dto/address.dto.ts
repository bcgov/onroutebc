import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

/**
 * JSON representation of a physical address
 */
export class AddressDto extends BaseDto {

  @AutoMap()
  @ApiProperty({
    example: '55542',
    description:
      'The address id. Required for an update operation.',
    required: false,
  })
  addressId: string;

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
    description: 'A 2-character string indicating the province',
    required: true,
  })
  province: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'A 2-character string indicating the country',
    required: true,
  })
  country: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'Postal/zip code - 5 characters if US, 6 characters if CA.',
    required: true,
  })
  postalCode: string;
}
