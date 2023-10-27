import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PaymentReportIssuedBy } from '../../../../common/enum/payment-report-issued-by.enum';

export class CreatePaymentSummaryReportDto {
  @AutoMap()
  @ApiProperty({
    enum: PaymentReportIssuedBy,
    example: [PaymentReportIssuedBy.SELF],
    description: 'Permit Issued By value.',
    isArray: true,
  })
  @IsEnum(PaymentReportIssuedBy, { each: true })
  @ArrayMinSize(1)
  issuedBy: PaymentReportIssuedBy[];

  @AutoMap()
  @ApiProperty({
    example: '2023-10-11T23:26:51.170Z',
    description: 'Include records in the report from the given date and time',
  })
  @IsOptional()
  @IsDateString()
  fromDateTime: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-10-27T23:26:51.170Z',
    description: 'Include records in the report till the given date and time',
  })
  @IsOptional()
  @IsDateString()
  toDateTime: string;
}
