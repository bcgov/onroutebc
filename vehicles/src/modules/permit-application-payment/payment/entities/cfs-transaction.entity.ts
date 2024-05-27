import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../../common/entities/base.entity';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CfsFileStatus } from 'src/common/enum/cfs-file-status.enum';

@Entity({ name: 'permit.ORBC_CFS_TRANSACTION_DETAIL' })
export class CfsTransactionDetail extends Base {
  /**
   * A unique auto-generated ID for each permit transaction entity.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap(() => Transaction)
  @ManyToOne(() => Transaction, (transaction) => transaction.permitTransactions)
  @JoinColumn({ name: 'TRANSACTION_ID' })
  public transaction: Transaction;

  @AutoMap()
  @ApiProperty({
    example: 'INBOX.F3535.20240524150725',
    description: 'Represents the file name',
  })
  @Column({
    length: '30',
    name: 'FILE_NAME',
    nullable: true,
  })
  fileName: string;

  @AutoMap()
  @ApiProperty({
    example: 'READY',
    description: 'Represents the file status',
  })
  @Column({
    type: 'simple-enum',
    enum: CfsFileStatus,
    name: 'CFS_FILE_STATUS',
    nullable: false,
  })
  fileStatus: CfsFileStatus;

  @AutoMap()
  @ApiProperty({
    example: 'INBOX.F3535.20240524150725',
    description: 'Represents the file name',
  })
  @Column({
    length: '3000',
    name: 'ERROR_MESSAGE',
    nullable: true,
  })
  errorMessage: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'File Sent Date ',
  })
  @Column({
    name: 'PROCESSSING_DATE_TIME',
    nullable: true,
  })
  processingDateTime: Date;
}
