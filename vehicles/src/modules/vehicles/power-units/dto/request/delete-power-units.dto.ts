import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeletePowerUnitDto {
  @AutoMap()
  @ApiProperty({
    description: 'Power unit Ids.',
    isArray: true,
    type: String,
    example: ['74'],
  })
  @IsNumberString({}, { each: true })
  powerUnits: string[];
}
