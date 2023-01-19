import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PowerUnitTypeDto } from './power-unit-type.dto';

export class UpdatePowerUnitTypeDto extends PowerUnitTypeDto {
  @AutoMap()
  @ApiProperty({ example: '1', description: 'Sort Order' })
  sortOrder: string;
}
