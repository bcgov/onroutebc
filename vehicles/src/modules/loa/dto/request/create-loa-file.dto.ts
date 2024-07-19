import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { CreateLoaDto } from './create-loa.dto';

export class CreateLoaFileDto {
  /**
   * Loa file in binary format
   */
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File associated with the Letter of Authorization (Loa).',
  })
  @IsString()
  file: string;

  /**
   * Detailed information about the Loa
   */
  @AutoMap()
  @ApiProperty({
    description: 'Details of the Letter of Authorization (Loa).',
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateLoaDto)
  body: CreateLoaDto;
}
