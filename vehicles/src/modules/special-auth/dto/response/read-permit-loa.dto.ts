import { ApiProperty } from '@nestjs/swagger';
import { LoaDetail } from '../../entities/loa-detail.entity';

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
    type: LoaDetail,
    description: 'Loa details',
  })
  loa: LoaDetail;
}
