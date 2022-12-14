import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class PowerUnitTypeDto extends BaseDto {
  @ApiProperty({
    description: 'The Power Unit Type ID',
  })
  typeId: number;

  @ApiProperty({ example: 'Truck Tractor', description: 'Power Unit Type' })
  type: string;

  @ApiProperty({
    example: 'Truck Tractor',
    description: 'Power Unit Description',
  })
  description: string;

  @ApiProperty({ example: 'TODO', description: 'Power Type Alias' })
  alias: string;
}
