import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class GetShoppingCartQueryParamsDto {
  @ApiPropertyOptional({
    description: `Id of the company the cart belongs to. Mandatory for IDIR users; BCeID users must not send.`,
    example: 74,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
