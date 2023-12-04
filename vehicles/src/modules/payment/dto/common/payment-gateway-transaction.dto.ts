import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class PaymentGatewayTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '10000148',
    description:
      'Bambora-assigned eight-digit unique id number used to identify an individual transaction.',
  })
  @IsOptional()
  @IsString()
  pgTransactionId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  @IsOptional()
  @IsNumber()
  pgApproved: number;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description:
      'Represents the auth code of a transaction. If the transaction is approved this parameter will contain a unique bank-issued code.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 32)
  pgAuthCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the type of card used in the transaction.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 2)
  pgCardType: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-10-11T23:26:51.170Z',
    description:
      'Represents the date and time that the transaction was processed.',
  })
  @IsOptional()
  @IsString()
  pgTransactionDate: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the card cvd match status.',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(6)
  pgCvdId: number;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 2)
  pgPaymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 111,
    description:
      'References a detailed approved/declined transaction response message.',
  })
  @IsOptional()
  @IsNumber()
  pgMessageId: number;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description:
      'Represents basic approved/declined message for a transaction.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  pgMessageText: string;
}
