import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CountryDto } from './country.dto';

export class ProvinceDto {
  @AutoMap()
  @ApiProperty({ example: 'BC', description: 'Province Code' })
  provinceCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'British Columbia',
    description: 'Province Name',
  })
  provinceName: string;

  @AutoMap(() => CountryDto)
  @ApiProperty({ example: 'CA', description: 'Country Code' })
  country: CountryDto;
}
