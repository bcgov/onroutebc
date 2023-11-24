import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ResendPermitDto {

  @AutoMap()
  @ApiProperty({
    example: 'user@user.com',
    description: 'Email address to deliver the permit.',
  })
  @IsString()
  @MinLength(1)
  email: string;

  @AutoMap()
  @ApiProperty({
    example: '(111)222-3333',
    description: 'Fax number to deliver the permit.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  fax: string;

}
