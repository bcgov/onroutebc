import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsInt,
  IsNumberString,
  IsPositive,
} from 'class-validator';

export class CreatePermitLoaDto {
  @ApiProperty({
    description: 'Permit id',
    example: 1,
  })
  @IsNumberString()
  permitId: string;

  @ApiProperty({
    description: 'Loa Ids to be assigned to the permit.',
    isArray: true,
    example: [74],
  })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayMinSize(1)
  loaId: number[];
}
