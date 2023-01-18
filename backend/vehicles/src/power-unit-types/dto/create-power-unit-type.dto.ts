import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePowerUnitTypeDto } from './update-power-unit-type.dto';

export class CreatePowerUnitTypeDto extends UpdatePowerUnitTypeDto {
  @AutoMap()
  @ApiProperty({ example: 'CONCRET', description: 'The Power Unit Type Code' })
  typeCode: string;
}
