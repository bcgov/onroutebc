import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CompanyIdPathParamDto {
  @ApiProperty({
    description: `Id of the company to which the resource belongs to.`,
    example: 74,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  companyId: number;
}
