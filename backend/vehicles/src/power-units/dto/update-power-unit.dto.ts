import { PartialType } from '@nestjs/swagger';
import { CreatePowerUnitDto } from './create-power-unit.dto';

export class UpdatePowerUnitDto extends PartialType(CreatePowerUnitDto) {}
