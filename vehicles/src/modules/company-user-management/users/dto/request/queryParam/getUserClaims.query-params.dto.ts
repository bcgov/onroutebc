import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class GetUserClaimsQueryParamsDto {
  @ApiProperty({
    description: `Id of the company the user is associated with. When provided, the API will return the roles of the user associated with the given id. This is an optional field.`,
    example: 74,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
