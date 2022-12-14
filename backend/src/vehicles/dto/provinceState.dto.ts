import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { CountryDto } from './country.dto';

export class ProvinceStateDto extends BaseDto {
  @ApiProperty({
    description: 'The Province/State ID',
  })
  provinceStateId: number;

  @ApiProperty({
    example: 'British Columbia',
    description: 'Province State Name',
  })
  provinceStateName: string;

  @ApiProperty({ example: 'BC', description: 'Province State Code' })
  provinceStateCode: string;

  @ApiProperty({ example: '1', description: 'Country ID' })
  country: CountryDto;
}
