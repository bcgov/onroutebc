import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';
import { BaseDto } from './base.dto';

export class VehicleDto extends BaseDto{
  @ApiProperty({
    description: 'The Unit #',
    example: 'Ken1'
  })
  unitId: string;

  @ApiProperty({
    description: 'The vehicle plate Number',
    example: 'AS 5895'
  })
  plate: string;

  @ApiProperty({
    description: 'The province/state where the vehicle is registered',
    example: 'BC'
  })
  provinceState: string;

  @ApiProperty({
    description: 'The Country of registration',
    example:'CA'
  })
  country: string;

  @ApiProperty({
    description: 'The Year Of Manufacture',
    example: '2010'
  })
  year: number;

  @ApiProperty({
    description: 'The make of the vehicle',
    example: 'Kenworth'
  })
  make: string;

  @ApiProperty({
    description: 'The vin of the vehicle',
    example: '1ZVFT80N475211367'
  })
  vin: string;

  // @ApiProperty({
  //   description: 'Created Date and Time'
  // })
  // createdDateTime: Timestamp;

  // @ApiProperty({
  //   description: 'Updated Date and Time'
  // })
  // updatedDateTime: Timestamp;
}
