import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../common/dto/base.dto';

export class TrailerTypeDto extends BaseDto {
  @ApiProperty({
    description: 'The Trailer Type ID',
  })
  typeId: number;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type' })
  type: string;

  @ApiProperty({
    example: 'TODO',
    description: 'TODO',
  })
  description: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Alias' })
  alias: string;
}
