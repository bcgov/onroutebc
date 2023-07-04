import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the transaction metadata.',
  })
  transactionId: number;

  @AutoMap()
  @ApiProperty({
    example: 'P',
    description: 'Represents the original value sent to indicate the type of transaction to perform (i.e. P, R, VP, VR, PA, PAC, Q).',
  })
  @IsString()
  @MaxLength(3)
  transactionType: string;

  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  @IsString()
  transactionOrderNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  @IsNumber()
  transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  @IsNumber()
  approved: number;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description: 'Represents the auth code of a transaction. If the transaction is approved this parameter will contain a unique bank-issued code.',
  })
  @IsString()
  authCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the type of card used in the transaction.',
  })
  @IsString()
  cardType: string;

  @AutoMap()
  @ApiProperty({
    example: '6/23/2023 10:57:28 PM',
    description: 'Represents the date and time that the transaction was processed.',
  })
  @IsString()
  transactionDate: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the card cvd match status.',
  })
  @IsNumber()
  cvdId: number;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  @IsString()
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'The identifier of the user selected payment method.',
  })
  @IsNumber()
  paymentMethodId: number;

  @AutoMap()
  @ApiProperty({
    example: '111',
    description: 'References a detailed approved/declined transaction response message.',
  })
  @IsString()
  messageId: string;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description: 'Represents basic approved/declined message for a transaction.',
  })
  @IsString()
  messageText: string;

}
