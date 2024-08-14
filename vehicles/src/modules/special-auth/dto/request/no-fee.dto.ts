import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, MaxLength } from 'class-validator';
import { NoFeeType } from 'src/common/enum/no-fee-type.enum';

export class NoFeeDto {
  @AutoMap()
  @ApiProperty({
    enum: NoFeeType,
    description: 'No Fee Type',
    example: NoFeeType.CA_GOVT,
    required: true,
  })
  @IsEnum(NoFeeType)
  noFeeType: NoFeeType;

  @AutoMap()
  @ApiProperty({
    type: 'string',
    description: 'Summary/Description of no fee category.',
    example: '',
    required: true,
  })
  @MaxLength(100)
  desctiption: string;
}
