import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadPermitTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the transaction metadata.',
  })
  transactionId: number;

  @AutoMap()
  @ApiProperty({
    example: 'T1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  transactionOrderNumber: string;

  // TODO: Multiple permits to be associated with a transaction
  // TODO: Use PermitDto
  // @AutoMap()
  // @ApiProperty({
  //   description: 'Permit Ids.',
  //   isArray: true,
  //   type: String,
  //   example: ['1', '2'],
  // })
  // permits?: Permit[];

  // TODO: Multiple transactions
  // TODO: Use TransactionDto
  // @AutoMap()
  // @ApiProperty({
  //   description: 'Transaction Ids.',
  //   isArray: true,
  //   type: String,
  //   example: ['1', '2'],
  // })
  // transactions?: Transaction[];
}
