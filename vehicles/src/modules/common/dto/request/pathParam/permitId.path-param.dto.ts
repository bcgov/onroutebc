import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { CompanyIdPathParamDto } from './companyId.path-param.dto';

export class PermitIdPathParamDto extends CompanyIdPathParamDto{
  @ApiProperty({
    description: `Id of the permit.`,
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  permitId: string;
}
