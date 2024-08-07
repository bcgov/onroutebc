import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';
import { NoFeeType } from 'src/common/enum/no-fee-type.enum';

export class UpsertSpecialAuthDto {
  @AutoMap()
  @ApiProperty({
    type: 'boolean',
    example: false,
    description:
      'Indicates whether the company is permitted to operate long combination vehicles',
    required: false,
  })
  @IsOptional()
  isLcvAllowed: boolean;

  @AutoMap()
  @ApiProperty({
    enum: NoFeeType,
    example: NoFeeType.CA_GOVT,
    description: 'Detailed reason of no fee type permit.',
    required: false,
  })
  @IsOptional()
  noFeeType: NoFeeType;
}
