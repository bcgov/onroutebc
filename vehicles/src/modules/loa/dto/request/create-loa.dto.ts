import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class CreateLoaDto {
  @AutoMap()
  @MaxLength(10)
  @ApiProperty({
    type: 'string',
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  @IsDateString()
  startDate: string;

  @AutoMap()
  @IsOptional()
  @MaxLength(10)
  @ApiProperty({
    type: 'string',
    required: false,
    example: '2023-08-13',
    description: 'Effective end date of an LoA',
  })
  @IsDateString()
  expiryDate: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    example: 'These are some additional notes for LoA.',
    description: 'Comments/Notes related to LoA.',
  })
  comment: string;

  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    isArray: true,
    example: [PermitType.TERM_OVERSIZE, PermitType.TERM_OVERWEIGHT],
  })
  @IsEnum(PermitType, { each: true })
  loaPermitType: PermitType[];

  @AutoMap()
  @ApiProperty({
    description: 'Trailer Ids.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @ValidateIf((dto) => !dto.powerUnits || (dto.powerUnits && dto.trailers))
  @IsNumberString({}, { each: true })
  trailers: string[];

  @AutoMap()
  @ApiProperty({
    description: 'Power unit Ids.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @ValidateIf((dto) => !dto.trailers || (dto.powerUnits && dto.trailers))
  @IsNumberString({}, { each: true })
  powerUnits: string[];
}
