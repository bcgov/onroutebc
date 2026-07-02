import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreditAccountNumberPathParamDto {
  @ApiProperty({
    example: 'WS0001',
    description: 'The credit account number.',
    required: true,
  })
  @IsString()
  @Length(1, 12)
  creditAccountNumber: string;
}
