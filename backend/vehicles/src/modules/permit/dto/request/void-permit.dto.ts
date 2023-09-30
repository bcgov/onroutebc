import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
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
    required: false,
  })
  @IsOptional()
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
  @Min(0)
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
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 2)
  pgPaymentMethod: string;

  @AutoMap()
  @ApiProperty({
    example: 'VI',
    description: 'Represents the card type used for the transaction.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 2)
  pgCardType: string;

  @AutoMap()
  @ApiProperty({
    example: 'This permit was voided because of so-and-so reason',
    description: 'Comment/Reason for voiding or revoking a permit.',
  })
  @IsString()
  @MinLength(1)
  comment: string;
}
