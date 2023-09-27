import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsPositive } from 'class-validator';

export class CreateApplicationTransactionDto {
  @AutoMap()
  @ApiProperty({
    description: 'Application/Permit Id.',
    example: '1',
  })
  @IsNumberString()
  applicationId: string;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  @IsNumber()
  @IsPositive()
  transactionAmount: number;
}
