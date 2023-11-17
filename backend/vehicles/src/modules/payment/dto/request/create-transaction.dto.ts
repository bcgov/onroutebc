import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TransactionType } from '../../../../common/enum/transaction-type.enum';
import { PaymentMethodType } from '../../../../common/enum/payment-method-type.enum';

import { Type } from 'class-transformer';
import { PaymentGatewayTransactionDto } from '../common/payment-gateway-transaction.dto';
import { CreateApplicationTransactionDto } from './create-application-transaction.dto copy';
import { PaymentCardType } from '../../../../common/enum/payment-card-type.enum';

export class CreateTransactionDto extends PaymentGatewayTransactionDto {
  @AutoMap()
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.PURCHASE,
    description:
      'Represents the original value sent to indicate the type of transaction to perform.',
  })
  @IsEnum(TransactionType)
  transactionTypeId: TransactionType;

  @AutoMap()
  @ApiProperty({
    enum: PaymentMethodType,
    example: PaymentMethodType.WEB,
    description: 'The identifier of the user selected payment method.',
  })
  @IsEnum(PaymentMethodType)
  paymentMethodTypeCode: PaymentMethodType;

  @AutoMap()
  @ApiProperty({
    enum: PaymentCardType,
    example: PaymentCardType.VISA,
    description: 'The identifier of the user selected payment type.',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentCardType)
  paymentCardTypeCode?: PaymentCardType;

  @AutoMap()
  @ApiProperty({
    description: 'The transaction details specific to application/permit.',
    required: true,
    type: [CreateApplicationTransactionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateApplicationTransactionDto)
  applicationDetails: CreateApplicationTransactionDto[];
}
