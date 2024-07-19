import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class CreateLoaDto {
  @AutoMap()
  @ApiProperty({
    type: 'string',
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  @MaxLength(10)
  @IsDateString()
  startDate: string;

  @AutoMap()
  @ApiProperty({
    type: 'string',
    required: false,
    example: '2023-08-13',
    description: 'Effective end date of an LoA',
  })
  @IsOptional()
  @MaxLength(10)
  @IsDateString()
  expiryDate?: string;

  @AutoMap()
  @ApiProperty({
    example: 'These are some additional notes for LoA.',
    description: 'Comments/Notes related to LoA.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  comment?: string;

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
  @IsOptional()
  @IsNumberString({}, { each: true })
  @ArrayMinSize(1)
  trailers?: string[];

  @AutoMap()
  @ApiProperty({
    description: 'Power unit Ids.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  @IsOptional()
  @IsNumberString({}, { each: true })
  @ArrayMinSize(1)
  powerUnits?: string[];
}
