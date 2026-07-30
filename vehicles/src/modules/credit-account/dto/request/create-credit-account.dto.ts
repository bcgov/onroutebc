import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCreditAccountDto {
  @AutoMap()
  @ApiProperty({
    description: 'The credit account number.',
    example: 'WS5667',
    maxLength: 6,
    minLength: 1,
  })
  @IsString()
  @Length(1, 6)
  creditAccountNumber: string;
}
