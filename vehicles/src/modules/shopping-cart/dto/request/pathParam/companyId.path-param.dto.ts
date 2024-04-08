import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CompanyIdPathParamDto {
  @ApiProperty({
    description: `Id of the company the cart belongs to.`,
    example: 74,
  })
  @IsInt()
  @IsPositive()
  companyId: number;
}
