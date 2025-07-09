import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional, IsString, Length } from 'class-validator';

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
  @Length(1, 250)
  fileName?: string;
}
