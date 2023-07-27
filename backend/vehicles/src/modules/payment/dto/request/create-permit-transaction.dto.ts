import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermitTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Represents the ID of a transaction.',
  })
  transactionId: number;
}
