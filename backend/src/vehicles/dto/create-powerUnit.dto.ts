import { PickType } from '@nestjs/swagger';
import { PowerUnitDto } from './powerUnit.dto';

export class CreatePowerUnitDto extends PickType(PowerUnitDto, [
'unitId',
'plate',
'provinceState',
'country',
'year',
'make',
'vin',
'licensedGvw',
'powerUnitType',
] as const) {}
