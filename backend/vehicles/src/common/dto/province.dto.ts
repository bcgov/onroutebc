import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { CountryDto } from './country.dto';

export class ProvinceDto extends BaseDto {
  @ApiProperty({
    description: 'The Province ID',
  })
  provinceId: number;

  @ApiProperty({
    example: 'British Columbia',
    description: 'Province Name',
  })
  provinceName: string;

  @ApiProperty({ example: 'BC', description: 'Province Code' })
  provinceCode: string;

  @ApiProperty({ example: '1', description: 'Country ID' })
  country: CountryDto;
}
