import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePowerUnitDto {
  @AutoMap()
  @ApiProperty({
    description: 'Power unit Ids.',
    isArray: true,
    type: [String],
    example: ['74'],
  })
  powerUnits: string[];
}
