import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Allow()
  file: string;
}
