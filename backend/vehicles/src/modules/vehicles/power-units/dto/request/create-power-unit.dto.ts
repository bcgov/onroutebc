import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsISO31661Alpha2,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePowerUnitDto {
  @AutoMap()
  @ApiProperty({
    description:
      'Number or code that the company uses to refer to the vehicle.',
    example: 'KEN1',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MaxLength(10)
  unitNumber?: string;

  @AutoMap()
  @ApiProperty({
    description: 'License plate.',
    example: 'AS 5895',
  })
  @IsString()
  @IsAlphanumeric()
  @MaxLength(10)
  plate: string;

  @AutoMap()
  @ApiProperty({
    example: 'BC',
    description:
      'A 2-character string indicating the Canadian province or US state of registration of the vehicle. ' +
      'Required if the countryCode is either CA or US.',
    required: false,
  })
  provinceCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'CA',
    description:
      'A 2-character string indicating the country of registration of the vehicle.',
    required: true,
  })
  @IsISO31661Alpha2()
  countryCode: string;

  @AutoMap()
  @ApiProperty({
    description: 'Year of manufacture of the vehicle.',
    example: '2010',
  })
  @IsNumber()
  @IsPositive()
  @Min(1950)
  year: number;

  @AutoMap()
  @ApiProperty({
    description: 'Make (manufacturer) of the vehicle.',
    example: 'Kenworth',
  })
  @IsString()
  @IsAlphanumeric()
  @MaxLength(20)
  make: string;

  @AutoMap()
  @ApiProperty({
    description:
      'Short vehicle identification number (last 6 characters) for the power unit.',
    example: '1ZVFT8',
  })
  @IsString()
  @IsAlphanumeric()
  @Length(6, 6, { message: 'vin must be equal to $constraint1 characters.' })
  vin: string;

  @AutoMap()
  @ApiProperty({
    description: 'Licensed gross vehicle weight of the power unit.',
    example: '35600',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  licensedGvw?: number;

  @AutoMap()
  @ApiProperty({
    description: 'Type of the power unit.',
    example: 'CONCRET',
  })
  powerUnitTypeCode: string;

  @AutoMap()
  @ApiProperty({
    description: 'Size of the steer axle tires (width).',
    example: '32',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  steerAxleTireSize?: number;
}
