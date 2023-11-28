import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { Allow, IsEnum, IsString } from 'class-validator';
import { ReportTemplate } from '../../../../enum/report-template.enum';

export class CreateGeneratedReportDto {
  @AutoMap()
  @ApiProperty({
    enum: ReportTemplate,
    example: ReportTemplate.PAYMENT_AND_REFUND_DETAILED_REPORT,
    description: 'The template that will be used to render the Report.',
  })
  @IsEnum(ReportTemplate)
  reportTemplate: ReportTemplate;

  @AutoMap()
  @ApiProperty({
    description: 'The template data.',
    required: true,
    example: {
      issuedBy: 'Self Issued and PPC',
      runDate: 'Jul. 17, 2023, 09:00 PM, PDT',
      permitType: 'All Permit Types',
      paymentMethod:
        'Cash, Cheque, Icepay - Mastercard, Icepay - Mastercard ' +
        '(Debit), Icepay - Visa, Icepay - Visa (Debit), Web - Mastercard (Debit), Web - Visa (Debit), PoS - ' +
        'Mastercard (Debit), PoS - Visa (Debit), PoS - Mastercard',
      timePeriod: 'Jul. 17, 2023, 09:00 PM, PDT – Jul. 18, 2023, 09:00 PM, PDT',
      payments: [
        {
          issuedOn: '2023-11-11T23:26:51.170Z',
          providerTransactionId: '73582422238',
          orbcTransactionId: 'OR-678904512857',
          paymentMethod: 'Cash',
          receiptNo: '45098721098',
          permitNo: 'P2-72106199-468',
          permitType: 'STOS',
          users: 'ANPETRIC',
          amount: '90.00',
        },
      ],
      refunds: [
        {
          issuedOn: '2023-11-11T23:26:51.170Z',
          providerTransactionId: '73582422238',
          orbcTransactionId: 'OR-678904512857',
          paymentMethod: 'Cheque',
          receiptNo: '51961102630',
          permitNo: 'P2-15348742-610',
          permitType: 'TROS',
          users: 'KOPARKIN',
          amount: '10.00',
        },
      ],
      summaryPaymentsAndRefunds: [
        {
          paymentMethod: 'Cash',
          payment: '90.00',
          refund: null,
          deposit: '90.00',
        },
        {
          paymentMethod: 'Cheque',
          payment: null,
          refund: '10.00',
          deposit: '90.00',
        },
        {
          paymentMethod: 'totalAmount',
          payment: '90.00',
          refund: '10.00',
          deposit: '80.00',
        },
      ],
      summaryPermits: [
        {
          permitType: 'STOS',
          permitCount: '1',
        },
        {
          permitType: 'TROS',
          permitCount: '1',
        },
        {
          permitType: 'totalPermitCount',
          permitCount: '2',
        },
      ],
    },
  })
  @Allow()
  //TODO Change to String and validate if JSON String
  reportData: object;

  @AutoMap()
  @ApiProperty({
    example: 'Financial-A-2-3-4-5',
    description: 'The generated file name. Do not include file extentions.',
    required: true,
  })
  @IsString()
  generatedDocumentFileName: string;
}
