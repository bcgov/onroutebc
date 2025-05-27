import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

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
  @IsString()
  @Length(1, 150)
  addressLine1: string;

  @AutoMap()
  @ApiProperty({
    example: 'Unit 321',
    description:
      'An additional segment of the address (if address line 1 is insufficient)',
    required: false,
    format: 'Alphanumeric',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  addressLine2?: string;

  @AutoMap()
  @ApiProperty({
    example: 'Vancouver',
    description: 'City',
    required: true,
    format: 'Alphabetic',
  })
  @IsString()
  @Length(1, 100)
  city: string;

  @AutoMap()
  @ApiProperty({
    example: 'BC',
    description:
      'A 2-character string indicating the province. ' +
      'Required if the countryCode is either CA or US.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 2, {
    message: 'provinceCode must be equal to $constraint1 characters.',
  })
  provinceCode?: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'A 2-character string indicating the country.',
    required: true,
  })
  @IsString()
  @Length(2, 2, {
    message: 'countryCode must be equal to $constraint1 characters.',
  })
  countryCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'V8W2E7',
    description: 'Postal/zip code - 5 characters if US, 6 characters if CA.',
    required: true,
  })
  @IsString()
  @Length(5, 15)
  postalCode: string;
}
