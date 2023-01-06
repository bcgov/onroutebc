import { PickType } from '@nestjs/swagger';
import { PowerUnitDto } from './power-unit.dto';

export class CreatePowerUnitDto extends PickType(PowerUnitDto, [
  'unitNumber',
  'plateNumber',
  'province',
  'year',
  'make',
  'vin',
  'licensedGvw',
  'powerUnitType',
  'steerAxleTireSize',
] as const) {}
