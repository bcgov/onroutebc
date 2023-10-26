import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../../common/enum/transaction-type.enum';

export class PermitHistoryDto {
  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description:
      'Unique formatted permit number, recorded once the permit is approved and issued.',
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was amended because of so-and-so reason.',
    description:
      'Any comment/reason that was made for modification of the permit',
  })
  comment: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was amended because of so-and-so reason.',
    description: 'The username of user that amended/voided the permit',
  })
  commentUsername: string;

  @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  transactionOrderNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '10000148',
    description:
      'Bambora-assigned eight-digit unique id number used to identify an individual transaction.',
  })
  pgTransactionId: string;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction from Bambora.',
  })
  pgPaymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the card type used by a transaction.',
  })
  pgCardType: string;

  @AutoMap()
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.PURCHASE,
    description:
      'Represents the original value sent to indicate the type of transaction to perform.',
  })
  transactionTypeId: TransactionType;
}
