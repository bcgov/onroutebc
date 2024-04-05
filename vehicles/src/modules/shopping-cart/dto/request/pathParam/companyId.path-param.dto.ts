import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class CompanyIdPathParamDto {
  @ApiProperty({
    description: `Id of the company the cart belongs to.`,
    example: 74,
  })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @IsPositive()
  companyId: number;
}
