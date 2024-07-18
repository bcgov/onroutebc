import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, ValidateNested } from 'class-validator';

import { CreateLoaDto } from './create-loa.dto';

export class CreateLoaFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @Allow()
  file: string;

  @AutoMap()
  @ApiProperty({
    description: 'Loa details.',
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateLoaDto)
  body: CreateLoaDto;
}
