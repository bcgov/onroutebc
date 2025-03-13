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
import { VehicleType } from '../../../../common/enum/vehicle-type.enum';

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
    description: `The vehicle type. It can have values ${Object.values(VehicleType).join(', ')}`,
    example: VehicleType.POWER_UNIT,
    enum: VehicleType,
  })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @AutoMap()
  @ApiProperty({
    description: 'Power unit types or trailer types',
    example: 'BUSCRUM',
  })
  @IsString()
  @Length(1, 7)
  vehicleSubType: string;
}
