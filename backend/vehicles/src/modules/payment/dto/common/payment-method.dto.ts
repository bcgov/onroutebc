import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentMethodTypeReport } from '../../../../common/enum/payment-method-type.enum';
import { PaymentCardType } from '../../../../common/enum/payment-card-type.enum';

export class PaymentMethodDto {
  @AutoMap()
  @ApiProperty({
    example: PaymentMethodTypeReport.WEB,
    enum: PaymentMethodTypeReport,
    description: 'The payment method types.',
  })
  @IsEnum(PaymentMethodTypeReport)
  paymentMethodTypeCode: PaymentMethodTypeReport;

  @AutoMap()
  @ApiProperty({
    example: PaymentCardType.VISA,
    enum: PaymentCardType,
    description: 'The payment types.',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentCardType)
  paymentCardTypeCode?: PaymentCardType;
}
