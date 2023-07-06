import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from 'src/modules/common/entities/base.entity';

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
  @PrimaryColumn({
    name: 'TRANSACTION_ID',
  })
  transactionId: number;

  // @ManyToOne(
  //   () => Permit,
  //   permit => permit.permitId,
  //   {onDelete: 'NO ACTION'}
  // )
  // @JoinColumn([{ name: 'PERMIT_ID', referencedColumnName: 'permitId' }])
  // permits?: Permit[];

  // @ManyToOne(
  //   () => Transaction,
  //   transaction => transaction.transactionId,
  //   {onDelete: 'NO ACTION'}
  // )
  // @JoinColumn([{ name: 'TRANSACTION_ID', referencedColumnName: 'transactionId' }])
  // transactions?: Transaction[];
}
