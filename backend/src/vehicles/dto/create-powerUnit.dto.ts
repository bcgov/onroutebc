import { PickType } from '@nestjs/swagger';
import { PowerUnitDto } from './powerUnit.dto';

export class CreatePowerUnitDto extends PickType(PowerUnitDto, [
'unitNumber',
'plateNumber',
'provinceState',
'year',
'make',
'vin',
'licensedGvw',
'powerUnitType',
'steerAxleTireSize'
] as const) {}
