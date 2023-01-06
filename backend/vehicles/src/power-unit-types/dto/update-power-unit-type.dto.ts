import { PartialType } from '@nestjs/swagger';
import { CreatePowerUnitTypeDto } from './create-power-unit-type.dto';

export class UpdatePowerUnitTypeDto extends PartialType(
  CreatePowerUnitTypeDto,
) {}
