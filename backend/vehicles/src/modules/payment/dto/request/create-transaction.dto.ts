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
import { CreateApplicationTransactionDto } from './create-application-transaction.dto';
import { Type } from 'class-transformer';
import { PaymentGatewayTransactionDto } from '../common/payment-gateway-transaction.dto';
import { PaymentType } from '../../../../common/enum/payment-type.enum';

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
  paymentMethodId: PaymentMethodType;

  @AutoMap()
  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.VISA,
    description: 'The identifier of the user selected payment type.',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

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
