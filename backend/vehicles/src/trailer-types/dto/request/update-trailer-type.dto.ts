import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrailerTypeDto {
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
  })
  description: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Order that the type should be presented in user interfaces.',
  })
  sortOrder: string;
}
