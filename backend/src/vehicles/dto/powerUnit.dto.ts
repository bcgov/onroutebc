import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';
import { VehicleDto } from './vehicle.dto';

export class PowerUnitDto extends VehicleDto {
  @ApiProperty({
    description: 'The Power Unit ID'
  })
  powerUnitId: number;

   @ApiProperty({
    description: 'The licensed GVW',
    example: '35600'
  })
  licensedGvw: number;

  @ApiProperty({
    description: 'The power unit type',
    example : 'Truck Tractor'
  })
  powerUnitType: string;
}
