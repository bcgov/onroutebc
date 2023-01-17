import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { CountryDto } from './country.dto';

export class ProvinceDto extends BaseDto {
  @ApiProperty({ example: 'BC', description: 'Province Code' })
  provinceCode: string;

  @ApiProperty({
    example: 'British Columbia',
    description: 'Province Name',
  })
  provinceName: string;

  @ApiProperty({ example: 'CA', description: 'Country Code' })
  country: CountryDto;
}
