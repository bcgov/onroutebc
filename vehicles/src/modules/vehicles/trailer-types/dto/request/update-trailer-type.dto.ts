import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateTrailerTypeDto {
  @AutoMap()
  @ApiProperty({
    example: 'Boosters',
    description: 'Short description of the trailer type.',
  })
  @IsString()
  @MaxLength(150)
  type: string;

  @AutoMap()
  @ApiProperty({
    example: 'A Booster is similar to a jeep, but it is used behind a load.',
    description: 'Long description of the trailer type.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Order that the type should be presented in user interfaces.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNumberString()
  sortOrder?: string;
}
