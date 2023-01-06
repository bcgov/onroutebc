import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';
import { ProvinceDto } from '../../common/dto/province.dto';
import { PowerUnitTypeDto } from '../../power-unit-types/dto/power-unit-type.dto';

export class PowerUnitDto extends BaseDto {
  @ApiProperty({
    description: 'The Power Unit ID',
  })
  powerUnitId: string;

  @ApiProperty({
    description: 'The Unit Number',
    example: 'Ken1',
  })
  unitNumber: string;

  @ApiProperty({
    description: 'The Power Unit plate Number',
    example: 'AS 5895',
  })
  plateNumber: string;

  @ApiProperty({
    description: 'The province/state where the vehicle is registered',
    example: '1',
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
    description: 'The vin of the vehicle',
    example: '1ZVFT80N475211367',
  })
  vin: string;

  @ApiProperty({
    description: 'The licensed GVW',
    example: '35600',
  })
  licensedGvw: number;

  @ApiProperty({
    description: 'The power unit type ID',
    example: '1',
  })
  powerUnitType: PowerUnitTypeDto;

  @ApiProperty({
    description: 'Steer Axle Tire Size',
    example: '32',
  })
  steerAxleTireSize: number;
}
