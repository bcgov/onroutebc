import { PickType } from '@nestjs/swagger';
import { PowerUnitTypeDto } from './power-unit-type.dto';

export class CreatePowerUnitTypeDto extends PickType(PowerUnitTypeDto, [
  'typeId',
  'type',
  'description',
  'alias',
] as const) {}
