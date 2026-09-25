import { ApiProperty } from '@nestjs/swagger';
import { ReadLoaDto } from '../../../../special-auth/dto/response/read-loa.dto';

export class ReadPermitLoaDto extends ReadLoaDto {
  @ApiProperty({
    description: 'Permit Loa id',
    example: 1,
  })
  permitLoaId: number;
}
