import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
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
