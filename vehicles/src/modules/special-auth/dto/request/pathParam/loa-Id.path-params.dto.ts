import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { CompanyIdPathParamDto } from '../../../../common/dto/request/pathParam/companyId.path-param.dto';
import { Type } from 'class-transformer';

export class LoaIdPathParamDto extends CompanyIdPathParamDto {
  @ApiProperty({
    example: 1,
    description:
      'The unique identifier for the credit account. This field is required.',
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  loaId: number;
}
