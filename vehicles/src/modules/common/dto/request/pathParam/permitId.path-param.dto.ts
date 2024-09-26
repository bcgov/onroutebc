import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class PermitIdPathParamDto {
  @ApiProperty({
    description: `Id of the permit.`,
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  permitId: string;
}
