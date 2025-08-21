import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../../../../../common/enum/transaction-type.enum';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PaymentCardType } from 'src/common/enum/payment-card-type.enum';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
} from '../../../../../common/enum/credit-account-status-type.enum';

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
    example: 'ALNAME',
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
    enum: TransactionType,
    example: PaymentMethodType.WEB,
    description: 'The identifier of the user selected payment method.',
  })
  paymentMethodTypeCode: PaymentMethodType;

  @AutoMap()
  @ApiProperty({
    enum: PaymentCardType,
    example: PaymentCardType.VISA,
    description: 'The identifier of the user selected payment type.',
  })
  paymentCardTypeCode: PaymentCardType;

  @AutoMap()
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.PURCHASE,
    description:
      'Represents the original value sent to indicate the type of transaction to perform.',
  })
  transactionTypeId: TransactionType;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Represents the id of a permit.',
  })
  permitId: number;

  @AutoMap()
  @ApiProperty({
    example: '2023-01-01 10:00:00.000000',
    description:
      'Represents the date that the transaction for the permit was submitted.',
  })
  transactionSubmitDate: Date;

  @AutoMap()
  @ApiProperty({
    example: '2023-01-01 10:00:00.000000',
    description:
      'Represents the date that the transaction was approved in ORBC.',
  })
  transactionApprovedDate: Date;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description:
      'Represents the approval result of a transaction. 0 = Transaction refused, 1 = Transaction approved',
  })
  pgApproved: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the credit account id used for a transaction.',
  })
  creditAccountId?: number;

  @AutoMap()
  @ApiProperty({
    example: CreditAccountStatus.ACCOUNT_ACTIVE,
    description:
      'Represents the current status of the credit account used for transaction',
  })
  creditAccountStatusType?: CreditAccountStatusType;
}
