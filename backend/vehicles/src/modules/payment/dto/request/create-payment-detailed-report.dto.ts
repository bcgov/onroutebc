import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PaymentReportIssuedBy } from '../../../../common/enum/payment-report-issued-by.enum';
import { PermitTypeReport } from '../../../../common/enum/permit-type.enum';
import { PaymentMethodDto } from '../common/payment-method.dto';
import { Type } from 'class-transformer';

export class CreatePaymentDetailedReportDto {
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
    description: 'The payment method details selected by user.',
    required: true,
    type: [PaymentMethodDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto[];

  @AutoMap()
  @ApiProperty({
    example: [PermitTypeReport.ALL],
    enum: PermitTypeReport,
    description: 'The permit types to include in the report.',
    isArray: true,
  })
  @IsEnum(PermitTypeReport, { each: true })
  @ArrayMinSize(1)
  permitType: PermitTypeReport[];

  @AutoMap()
  @ApiProperty({
    example: '2023-10-11T23:26:51.170Z',
    description: 'Include records in the report from the given date and time',
  })
  @IsDateString()
  fromDateTime: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-10-27T23:26:51.170Z',
    description: 'Include records in the report till the given date and time',
  })
  @IsDateString()
  toDateTime: string;

  @AutoMap()
  @ApiProperty({
    example: ['ORBCTST1'],
    description: 'PPC Staff user list',
    required: false,
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  users: string[];
}
