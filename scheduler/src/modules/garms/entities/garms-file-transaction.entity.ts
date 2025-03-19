import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permit.ORBC_GARMS_FILE_TRANSACTION' })
export class GarmsFileTransaction {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for file transaction table.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'File id',
  })
  @Column({ type: 'bigint', name: 'GARMS_EXTRACT_FILE_ID' })
  fileId: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Transaction Id.',
  })
  @Column({ type: 'bigint', name: 'TRANSACTION_ID' })
  transactionId: string;
}
