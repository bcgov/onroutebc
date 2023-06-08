import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Allow()
  file: string;

  @ApiProperty({
    type: 'string',
    example: 'sample_template.pdf',
    description: 'Name of this file within destination',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileName?: string;
}
