import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { CreateLoaDto } from './create-loa.dto';

export class UpdateLoaDto extends CreateLoaDto {
  @AutoMap()
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Loa Document Id',
    example: '1',
    required: false,
  })
  documentId?: string;
}
