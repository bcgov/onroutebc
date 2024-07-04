import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class CreateLoaDto {
  @AutoMap()
  @IsString()
  @MaxLength(24)
  @ApiProperty({
    example: '2023-07-13T00:00:00.000Z',
    description: 'Effective start date of an LoA',
  })
  startDate: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(24)
  @ApiProperty({
    example: '2023-08-13T00:00:00.000Z',
    description: 'Effective end date of an LoA',
  })
  expiryDate: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Loa Document',
  })
  document: Buffer;

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
  @IsEnum(PermitType, { each: true })
  @ApiProperty({
    isArray: true,
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: [PermitType.TERM_OVERSIZE, PermitType.TERM_OVERWEIGHT],
  })
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
  trailers: string[];

  @AutoMap()
  @ApiProperty({
    description: 'Power unit Ids.',
    isArray: true,
    type: String,
    example: ['1', '2'],
  })
  @IsOptional()
  @IsNumberString({}, { each: true })
  powerUnits: string[];
}
