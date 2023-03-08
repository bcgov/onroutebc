import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrailerDto {
  @AutoMap()
  @ApiProperty({
    description:
      'Number or code that the company uses to refer to the vehicle.',
    example: 'KEN1',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'License plate.',
    example: 'AS 5895',
  })
  plate: string;

  @AutoMap()
  @ApiProperty({
    description:
      'Canadian province or US state of registration of the vehicle.',
    example: 'CA-BC',
  })
  provinceId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Year of manufacture of the vehicle.',
    example: '2010',
  })
  year: number;

  @AutoMap()
  @ApiProperty({
    description: 'Make (manufacturer) of the vehicle.',
    example: 'Kenworth',
  })
  make: string;

  @AutoMap()
  @ApiProperty({
    description: 'Short vehicle identification number (last 6 characters) for the trailer.',
    example: '1ZVFT8',
  })
  vin: string;

  @AutoMap()
  @ApiProperty({
    description: 'Width in metres of the empty trailer.',
    example: '3.2',
  })
  emptyTrailerWidth: number;

  @AutoMap()
  @ApiProperty({
    description: 'Type of the trailer.',
    example: 'BOOSTER',
  })
  trailerTypeCode: string;
}
