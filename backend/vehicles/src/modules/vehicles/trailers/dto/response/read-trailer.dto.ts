import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadTrailerDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Unique identifier for this vehicle record in a company inventory.',
  })
  trailerId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Id of the company which owns the vehicle.',
  })
  companyId: number;

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
    example: 'BC',
    description:
      'A 2-character string indicating the Canadian province or US state of registration of the vehicle.',
  })
  provinceCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description:
      'A 2-character string indicating the country of registration of the vehicle.',
  })
  countryCode: string;

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
    description:
      'Short vehicle identification number (last 6 characters) for the trailer.',
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

  @AutoMap()
  @ApiProperty({
    description: 'Created Date and Time',
  })
  createdDateTime: string;
}
