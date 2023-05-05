import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadTrailerTypeDto {
  @AutoMap()
  @ApiProperty({
    example: 'BOOSTER',
    description: 'Unique identifier of the trailer type.',
  })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Boosters',
    description: 'Short description of the trailer type.',
  })
  type: string;

  @AutoMap()
  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Long description of the trailer type.',
    required: false,
  })
  description?: string;
}
