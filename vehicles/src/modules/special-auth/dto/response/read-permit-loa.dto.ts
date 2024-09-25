import { ApiProperty } from '@nestjs/swagger';
import { ReadLoaDto } from './read-loa.dto';

export class ReadPermitLoaDto {
  @ApiProperty({
    description: 'Permit Loa id',
    example: 1,
  })
  permitLoaId: number;

  @ApiProperty({
    description: 'Permit id',
    example: 1,
  })
  permitId: string;

  @ApiProperty({
    type: ReadLoaDto,
    description: 'Loa details',
  })
  loa: ReadLoaDto;
}
