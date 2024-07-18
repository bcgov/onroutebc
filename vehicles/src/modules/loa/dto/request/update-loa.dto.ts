import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class UpdateLoaDto {
  @AutoMap()
  @IsDateString()
  @MaxLength(10)
  @ApiProperty({
    type: 'string',
    example: '2023-07-13',
    description: 'Effective start date of an LoA',
  })
  startDate: string;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  @MaxLength(10)
  @ApiProperty({
    type: 'string',
    required: false,
    example: '2023-08-13',
    description: 'Effective end date of an LoA',
  })
  expiryDate: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  @Allow()
  file: string;

  @AutoMap()
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Loa Document Id',
    required: false,
  })
  documentId: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  @ApiProperty({
    required: false,
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
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @ValidateIf((dto) => !dto.trailers || (dto.powerUnits && dto.trailers))
  @IsNumberString({}, { each: true })
  powerUnits: string[];
}
