import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: 'P',
    description: 'Represents the original value sent to indicate the type of transaction to perform (i.e. P, R, VP, VR, PA, PAC, Q).',
  })
  transactionType: string;

  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  transactionOrderNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  approved: number;

  @AutoMap()
  @ApiProperty({
    example: 'TEST',
    description: 'Represents the auth code of a transaction. If the transaction is approved this parameter will contain a unique bank-issued code.',
  })
  authCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the type of card used in the transaction.',
  })
  cardType: string;

  @AutoMap()
  @ApiProperty({
    example: '6/23/2023 10:57:28 PM',
    description: 'Represents the date and time that the transaction was processed.',
  })
  transactionDate: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the card cvd match status.',
  })
  cvdId: number;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  paymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'The identifier of the user selected payment method.',
  })
  paymentMethodId: number;

  @AutoMap()
  @ApiProperty({
    example: '111',
    description: 'References a detailed approved/declined transaction response message.',
  })
  messageId: string;

  @AutoMap()
  @ApiProperty({
    example: 'Approved',
    description: 'Represents basic approved/declined message for a transaction.',
  })
  messageText: string;
}
