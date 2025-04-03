import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { NoFeeType } from 'src/common/enum/no-fee-type.enum';

export class ReadSpecialAuthDto {
  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Unique Identifier for special authorization.',
  })
  specialAuthId: number;

  @AutoMap()
  @ApiProperty({
    description: 'Id of the company requesting the LoA.',
    example: 74,
    required: false,
  })
  companyId: number;

  @AutoMap()
  @ApiProperty({
    type: 'boolean',
    example: false,
    description:
      'Indicates whether the company is permitted to operate long combination vehicles',
    required: false,
  })
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  isLcvAllowed?: boolean;

  @AutoMap()
  @ApiProperty({
    enum: NoFeeType,
    example: NoFeeType.CA_GOVT,
    description: 'Detailed reason of no fee type permit.',
    required: false,
  })
  @IsOptional()
  noFeeType?: NoFeeType;
}
