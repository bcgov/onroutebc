import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';

export class CountryDto extends BaseDto {
  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description: 'Country Code',
  })
  countryCode: string;

  @AutoMap()
  @ApiProperty({ example: 'CANADA', description: 'Country Name' })
  countryName: string;
}
