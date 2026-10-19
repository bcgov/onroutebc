import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '@modules/common/entities/base.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Nullable } from '@common/types/common';
import { PrepaidAccountDeposit } from './prepaid-account-deposit.entity';

@Entity({ name: 'permit.ORBC_PBI_FILE' })
export class PBIFile extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the PBI file.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: 'rbc.insp.20260727.151.txt',
    description: 'PBI File name.',
  })
  @Column({ name: 'FILE_NAME', length: 100, nullable: false })
  fileName: string;

  @AutoMap()
  @ApiProperty({
    description:
      'DMS Document ID used to retrieve the payment bill submission file',
  })
  @Column({
    name: 'DOCUMENT_ID',
    nullable: false,
  })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'File submit timestamp',
  })
  @Column({
    name: 'DOWNLOAD_TIMESTAMP',
    nullable: false,
  })
  downloadTimestamp: Date;

  /**
   * Specifies whether the file has been processed and records inserted into ORBC_PREPAID_ACCOUNT_DEPOSIT. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_PROCESSED',
    default: 'N',
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isProcessed: boolean;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description:
      'File processed and inserted into ORBC_PREPAID_ACCOUNT_DEPOSIT table timestamp',
    nullable: true,
  })
  @Column({
    name: 'PROCESSED_TIMESTAMP',
  })
  processedTimestamp: Date;

  @AutoMap()
  @OneToMany(
    () => PrepaidAccountDeposit,
    (prepaidAccountDeposit) => prepaidAccountDeposit.pbiFile,
  )
  prepaidAccountDeposits?: Nullable<PrepaidAccountDeposit[]>;
}
