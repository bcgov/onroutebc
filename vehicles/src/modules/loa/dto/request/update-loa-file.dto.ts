import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateLoaDto } from './update-loa.dto';

export class UpdateLoaFileDto {
  /**
   * File associated with the Letter of Authorization (Loa). This is an optional
   * binary file represented as a string.
   */
  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'File associated with the Letter of Authorization (Loa).',
  })
  @IsOptional()
  @IsString()
  file?: string;

  /**
   * Details of the Letter of Authorization (Loa). This field is mandatory and
   * is validated using the UpdateLoaDto class.
   */
  @AutoMap()
  @ApiProperty({
    description: 'Details of the Letter of Authorization (Loa).',
    required: true,
  })
  @ValidateNested()
  @Type(() => UpdateLoaDto)
  body: UpdateLoaDto;
}
