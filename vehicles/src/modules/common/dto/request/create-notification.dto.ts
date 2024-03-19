import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification email ids.',
    example: ['someguy@mycompany.co', 'somegirl@mycompany.co'],
  })
  @IsEmail(undefined, {
    each: true,
  })
  @ArrayMinSize(1)
  to: string[];

  @AutoMap()
  @ApiProperty({
    description: 'The fax number to send the notification to.',
    required: false,
    maxLength: 20,
    minLength: 10,
    example: '9999999999',
  })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  fax?: string;
}
