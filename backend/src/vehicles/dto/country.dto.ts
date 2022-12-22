import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class CountryDto extends BaseDto {
  @ApiProperty({
    description: 'The Country ID',
  })
  countryId: number;

  @ApiProperty({ example: 'CANADA', description: 'Country Name' })
  countryName: string;

  // @ApiProperty({ example: 'CA', description: 'Country Code' })
  // countryCode: string;
}
