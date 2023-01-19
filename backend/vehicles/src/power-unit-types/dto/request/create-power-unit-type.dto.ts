import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePowerUnitTypeDto {
  @AutoMap()
  @ApiProperty({
    example: 'CONCRET',
    description: 'Unique identifier of the power unit type.',
  })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Concrete Pumper Trucks',
    description: 'Short description of the power unit type.',
  })
  type: string;

  @AutoMap()
  @ApiProperty({
    example:
      'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
    description: 'Long description of the power unit type.',
  })
  description: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Order that the type should be presented in user interfaces.',
  })
  sortOrder: string;
}
