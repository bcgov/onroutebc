import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize } from 'class-validator';

export class PermitIdDto {
  @ApiProperty({
    description: 'Permit ids.',
    example: ['1', '2'],
  })
  @ArrayMinSize(1)
  ids: string[];
}
