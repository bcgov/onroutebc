import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class UpdateLoaDto {
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
    required: false,
    example: '2023-08-13T00:00:00.000Z',
    description: 'Effective end date of an LoA',
  })
  expiryDate: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @Allow()
  file: string;

  @AutoMap()
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Loa Document Id',
  })
  documentId: string;

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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  @IsNumberString({}, { each: true })
  powerUnits: string[];
}
