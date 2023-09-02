import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class PermitHistoryDto {
    @AutoMap()
    @ApiProperty({
      example: 'P2-00000002-120',
      description:
        'Unique formatted permit number, recorded once the permit is approved and issued.',
    })
    permitNumber: string;
    @AutoMap()
    @ApiProperty({
      example: '',
      description:
        '',
    })
    comment: string;
    @AutoMap()
  @ApiProperty({
    example: '30.00',
    description: 'Represents the amount of the transaction.',
  })
  transactionAmount: number;

    @AutoMap()
    @ApiProperty({
      example: 'T-1687586193681',
      description: 'Represents the auth code of a transaction.',
    })
    transactionOrderNumber: string;
  
    @AutoMap()
    @ApiProperty({
      example: '10000148',
      description:
        'Bambora-assigned eight-digit unique id number used to identify an individual transaction.',
    })
    providerTransactionId: number;

    @AutoMap()
    @ApiProperty({
      example: 'CC',
      description: 'Represents the payment method of a transaction.',
    })
    paymentMethod: string;
    
}