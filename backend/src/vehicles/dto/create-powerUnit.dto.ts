import { PickType } from '@nestjs/swagger';
import { PowerUnitDto } from './powerUnit.dto';

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
