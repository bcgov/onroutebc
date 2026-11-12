import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BPIFile } from '@modules/bpi/entities/bpi-file.entity';

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
  @Column({ type: 'bigint', name: 'TRANSACTION_ID', nullable: true })
  transactionId?: string;

  @AutoMap()
  @ManyToOne(() => BPIFile, (BPIFile) => BPIFile.garmsFileTransactions, {
    eager: false,
    cascade: false,
  })
  @JoinColumn({ name: 'BPI_FILE_ID' })
  bpiFile: BPIFile;
}
