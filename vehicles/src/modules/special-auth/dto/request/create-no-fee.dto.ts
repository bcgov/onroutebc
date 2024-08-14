import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NoFeeType } from 'src/common/enum/no-fee-type.enum';

export class CreateNoFeeDto {
  @ApiProperty({
    enum: NoFeeType,
    example: NoFeeType.CA_GOVT,
    description: 'Detailed reason of no fee type permit.',
  })
  @IsOptional()
  @IsEnum(NoFeeType)
  noFeeType: NoFeeType;
}
