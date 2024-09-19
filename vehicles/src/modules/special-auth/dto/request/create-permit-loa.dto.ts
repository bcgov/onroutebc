import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, Min } from 'class-validator';

export class CreatePermitLoaDto {
  @ApiProperty({
    description: 'Permit id',
    example: 1,
  })
  @IsNumberString()
  permitId: string;

  @ApiProperty({
    description: 'Loa id',
    example: 1,
  })
  @IsNumber()
  @Min(0)
  loaId: number;
}
