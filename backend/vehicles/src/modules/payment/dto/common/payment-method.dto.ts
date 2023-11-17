import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentMethodTypeReport } from '../../../../common/enum/payment-method-type.enum';
import { PaymentType } from '../../../../common/enum/payment-type.enum';

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
    example: PaymentType.VISA,
    enum: PaymentType,
    description: 'The payment types.',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentTypeCode?: PaymentType;
}
