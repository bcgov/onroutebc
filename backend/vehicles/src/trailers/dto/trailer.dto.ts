import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';
import { ProvinceDto } from '../../common/dto/province.dto';
import { TrailerTypeDto } from '../../trailer-types/dto/trailer-type.dto';

export class TrailerDto extends BaseDto {
  @ApiProperty({
    description: 'The Trailer ID',
  })
  trailerId: string;

  @ApiProperty({
    description: 'The Unit Number',
    example: 'KEN1',
  })
  unitNumber: string;

  @ApiProperty({
    description: 'The Trailer plate Number',
    example: 'AS 5895',
  })
  plateNumber: string;

  @ApiProperty({
    description: 'The province/state where the vehicle is registered',
    example: 'BC',
  })
  province: ProvinceDto;

  @ApiProperty({
    description: 'The Year Of Manufacture',
    example: '2010',
  })
  year: number;

  @ApiProperty({
    description: 'The make of the vehicle',
    example: 'Kenworth',
  })
  make: string;

  @ApiProperty({
    description: 'The VIN of the vehicle',
    example: '1ZVFT80N475211367',
  })
  vin: string;

  @ApiProperty({
    description: 'The Empty Trailer Width',
    example: '3.2',
  })
  emptyTrailerWidth: number;

  // @ApiProperty({
  //   description: 'The Company ID',
  //   example: '12',
  // })
  // companyId: number;

  @ApiProperty({
    description: 'The Trailer Type',
    example: 'BOOSTR',
  })
  trailerType: TrailerTypeDto;
}
