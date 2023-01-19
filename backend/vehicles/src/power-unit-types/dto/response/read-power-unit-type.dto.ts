import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadPowerUnitTypeDto {
  @AutoMap()
  @ApiProperty({ example: 'CONCRET', description: 'The Power Unit Type Code' })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Concrete Pumper Trucks',
    description: 'Power Unit Type',
  })
  type: string;

  @AutoMap()
  @ApiProperty({
    example:
      'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
    description: 'Power Unit Description',
  })
  description: string;
}
