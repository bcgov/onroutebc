import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';

@Entity({ name: 'permit.ORBC_PERMIT_TRANSACTION' })
export class PermitTransaction extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  @PrimaryColumn({ type: 'bigint', name: 'PERMIT_ID' })
  permitId: number;

  @AutoMap()
  @ApiProperty({
    example: '10000203',
    description: 'Represents the ID of a transaction.',
  })
  @Column({
    name: 'TRANSACTION_ID',
    nullable: true,
  })
  transactionId: number;

  @AutoMap()
  @ApiProperty({
    example: 'T-1687586193681',
    description: 'Represents the auth code of a transaction.',
  })
  @Column({
    name: 'TRANSACTION_ORDER_NUMBER',
    nullable: true,
  })
  transactionOrderNumber: string;
}
