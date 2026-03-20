import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IsString, Length } from 'class-validator';

export class UpdateCreditAccountVerificationDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account verification comments.',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  @IsString()
  @Length(1, 4000)
  comment: string;
}
