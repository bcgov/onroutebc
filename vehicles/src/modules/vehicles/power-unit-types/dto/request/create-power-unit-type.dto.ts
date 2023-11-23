import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreatePowerUnitTypeDto {
  @AutoMap()
  @ApiProperty({
    example: 'CONCRET',
    description: 'Unique identifier of the power unit type.',
  })
  @IsString()
  @IsAlphanumeric()
  @Length(7, 7, {
    message: 'typeCode must be equal to $constraint1 characters.',
  })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Concrete Pumper Trucks',
    description: 'Short description of the power unit type.',
  })
  @IsString()
  @MaxLength(150)
  type: string;

  @AutoMap()
  @ApiProperty({
    example:
      'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
    description: 'Long description of the power unit type.',
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
