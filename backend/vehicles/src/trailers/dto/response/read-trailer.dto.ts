import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadTrailerDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Trailer ID',
  })
  trailerId: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Unit Number',
    example: 'KEN1',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Trailer plate Number',
    example: 'AS 5895',
  })
  plate: string;

  @AutoMap()
  @ApiProperty({
    description: 'The province/state where the vehicle is registered',
    example: 'CA-BC',
  })
  provinceId: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Year Of Manufacture',
    example: '2010',
  })
  year: number;

  @AutoMap()
  @ApiProperty({
    description: 'The make of the vehicle',
    example: 'Kenworth',
  })
  make: string;

  @AutoMap()
  @ApiProperty({
    description: 'The VIN of the vehicle',
    example: '1ZVFT80N475211367',
  })
  vin: string;

  @AutoMap()
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

  @AutoMap()
  @ApiProperty({
    description: 'The Trailer Type',
    example: 'BOOSTER',
  })
  trailerTypeCode: string;

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;
}
