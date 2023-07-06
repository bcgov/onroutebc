import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Transaction } from '../../entities/transaction.entity';

export class ReadPermitTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: '00000',
    description: 'Represents the ID of a transaction.',
  })
  permits?: Permit[];

  @AutoMap()
  transactionId: number;

  @AutoMap()
  transactions?: Transaction[];

  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  transactionOrderNumber: string;
}
