import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApplicationStatus } from 'src/common/enum/application-status.enum';
import { PaymentMethodType } from '../../../../common/enum/payment-method-type.enum';

export class VoidPermitDto {
  @AutoMap()
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'Revoke or void status for permit.',
    example: ApplicationStatus.REVOKED,
    required: false,
  })
  status: ApplicationStatus;

  @AutoMap()
  @ApiProperty({
    description: 'Permit Transaction ID.',
    example: 'T000000A0W',
  })
  pgTransactionId: string;

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
    description: 'Payment Transaction Amount.',
    example: 30,
  })
  @IsNumber()
  @IsPositive()
  transactionAmount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Payment Transaction Date.',
    example: '2023-07-10T15:49:36.582Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  pgTransactionDate: string;

  @AutoMap()
  @ApiProperty({
    example: 'CC',
    description: 'Represents the payment method of a transaction.',
  })
  @IsString()
  @Length(1, 2)
  pgPaymentMethod: string;
}
