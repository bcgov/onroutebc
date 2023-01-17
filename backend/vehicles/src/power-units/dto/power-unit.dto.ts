import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePowerUnitDto } from './create-power-unit.dto';

export class PowerUnitDto extends CreatePowerUnitDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Power Unit ID',
  })
  powerUnitId: string; 
}
