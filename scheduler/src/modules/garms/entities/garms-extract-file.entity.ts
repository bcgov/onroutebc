import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/modules/common/entities/base.entity';
import { GarmsExtractType } from 'src/modules/common/enum/garms-extract-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  })
  fileSubmitTimestamp: Date;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'From timestamp',
  })
  @Column({
    name: 'TRANSACTION_DATE_FROM',
  })
  fromTimestamp: Date;

  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'most recent date timestamp of submitted transation',
  })
  @Column({
    name: 'TRANSACTION_DATE_TO',
  })
  toTimestamp: Date;
}
