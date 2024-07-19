import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Allow, IsOptional, ValidateNested } from 'class-validator';
import { UpdateLoaDto } from './update-loa.dto';

export class UpdateLoaFileDto {
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  @Allow()
  file: string;

  @AutoMap()
  @ApiProperty({
    description: 'Loa details.',
    required: true,
  })
  @ValidateNested()
  @Type(() => UpdateLoaDto)
  body: UpdateLoaDto;
}
