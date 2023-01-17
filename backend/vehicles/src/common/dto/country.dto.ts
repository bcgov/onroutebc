import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class CountryDto extends BaseDto {
  @ApiProperty({
    example: 'CA',
    description: 'Country Code',
  })
  countryCode: string;

  @ApiProperty({ example: 'CANADA', description: 'Country Name' })
  countryName: string;
}
