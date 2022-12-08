import { PartialType } from '@nestjs/swagger';
import { CreatePowerUnitDto } from './create-powerUnit.dto';

export class UpdatePowerUnitDto extends PartialType(CreatePowerUnitDto) {}
