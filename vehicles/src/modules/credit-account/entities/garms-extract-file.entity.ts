import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { GarmsExtractType } from '../../../common/enum/garms-extract-type.enum';

@Entity({ name: 'permit.ORBC_GARMS_EXTRACT_FILE' })
export class GarmsExtractFile extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  fileId: string;

  @AutoMap()
  @ApiProperty({
    example: GarmsExtractType.CASH,
    description: 'Identifies file type',
  })
  @Column({
    length: 10,
    name: 'GARMS_EXTRACT_TYPE',
  })
  garmsExtractType: GarmsExtractType;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'File submit timestamp',
  })
  @Column({
    name: 'SUBMIT_TIMESTAMP',
    nullable: true,
  })
  fileSubmitTimestamp?: Date;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'From timestamp',
  })
  @Column({
    name: 'TRANSACTION_DATE_FROM',
    nullable: true,
  })
  fromTimestamp?: Date;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'most recent date timestamp of submitted transation',
  })
  @Column({
    name: 'TRANSACTION_DATE_TO',
    nullable: true,
  })
  toTimestamp?: Date;
}
