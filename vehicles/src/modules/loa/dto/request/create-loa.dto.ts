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
  ValidateIf,
  Length,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';
import { IsDateTimeAfter } from '../../../../common/decorator/is-date-time-after';

export class CreateLoaDto {
  @AutoMap()
  @ApiProperty({
    type: 'string',
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  @Length(10, 10)
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
  @Length(10, 10)
  @IsDateString()
  @IsDateTimeAfter<CreateLoaDto>('startDate')
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
    description: 'Types of permits included in the LoA.',
    isArray: true,
    example: [PermitType.TERM_OVERSIZE, PermitType.TERM_OVERWEIGHT],
  })
  @IsEnum(PermitType, { each: true })
  loaPermitType: PermitType[];

  @AutoMap()
  @ApiProperty({
    description:
      'Trailer IDs. At leaset one of trailers or power unit IDs are required.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  @ValidateIf((obj: CreateLoaDto) =>
    Boolean(obj.trailers?.length || !obj.powerUnits?.length),
  )
  @IsNumberString({}, { each: true })
  @ArrayMinSize(1)
  trailers?: string[];

  @AutoMap()
  @ApiProperty({
    description:
      'Power unit Ids. At least one of Trailers or Power Unit ids are required',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  @ValidateIf((obj: CreateLoaDto) =>
    Boolean(obj.powerUnits?.length || !obj.trailers?.length),
  )
  @IsNumberString({}, { each: true })
  @ArrayMinSize(1)
  powerUnits?: string[];
}
