import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsDateString, IsEnum } from 'class-validator';
import { PermitIssuedBy } from '../../../../../common/enum/permit-issued-by.enum';
import { IsDateTimeAfter } from '../../../../../common/decorator/is-date-time-after';

export class CreatePaymentSummaryReportDto {
  @AutoMap()
  @ApiProperty({
    enum: PermitIssuedBy,
    required: true,
    example: [PermitIssuedBy.SELF_ISSUED],
    description: 'Permit Issued By value.',
    isArray: true,
  })
  @IsEnum(PermitIssuedBy, { each: true })
  @ArrayMinSize(1)
  issuedBy: PermitIssuedBy[];

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
    description:
      'Include records in the report till the given date and time.'
  })
  @IsDateString()
  toDateTime: string;
}
