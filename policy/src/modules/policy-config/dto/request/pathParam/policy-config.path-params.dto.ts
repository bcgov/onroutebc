import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PolicyConfigIdPathParamDto {
  @ApiProperty({
    example: 1,
    description:
      'The unique identifier of the policy configuration. This field is required.',
    required: true,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  policyConfigId: number;
}
