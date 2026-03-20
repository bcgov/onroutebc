import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PermitType } from 'src/common/enum/permit-type.enum';

export class UpdateApplicationDto {
  @AutoMap()
  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type.',
    example: PermitType.TERM_OVERSIZE,
  })
  @IsOptional()
  @IsEnum(PermitType)
  permitType?: PermitType;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Application JSON.',
  })
  @Allow()
  permitData: JSON;

  @AutoMap()
  @ApiProperty({
    description: 'Amendment reason or comment.',
    example: 'This application was amended because of so-and-so reason.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  comment?: string;
}
