import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePowerUnitDto {
  @AutoMap()
  @ApiProperty({
    description: 'The Unit Number',
    example: 'KEN1',
  })
  unitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'The Power Unit plate Number',
    example: 'AS 5895',
  })
  plate: string;

  @AutoMap()
  @ApiProperty({
    description: 'The province/state where the vehicle is registered',
    example: 'BC',
  })
  provinceCode: string;

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
    description: 'The licensed GVW',
    example: '35600',
  })
  licensedGvw: number;

  @AutoMap()
  @ApiProperty({
    description: 'The power unit type Code',
    example: 'CONCRET',
  })
  powerUnitTypeCode: string;

  @AutoMap()
  @ApiProperty({
    description: 'Steer Axle Tire Size',
    example: '32',
  })
  steerAxleTireSize: number;
}
