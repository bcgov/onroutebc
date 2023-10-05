import { AutoMap } from '@automapper/classes';
import { PaymentGatewayTransactionDto } from '../common/payment-gateway-transaction.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReadPaymentGatewayTransactionDto extends PaymentGatewayTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the transaction metadata.',
  })
  transactionId: string;
}
