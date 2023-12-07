import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';

@Entity({ name: 'permit.ORBC_PERMIT' })
export class Permit extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  permitId: string;

  @AutoMap()
  @ApiProperty({
    example: 'P2-00000002-120',
    description:
      'Unique formatted permit number, recorded once the permit is approved and issued.',
  })
  @Column({
    length: '19',
    name: 'PERMIT_NUMBER',
    nullable: true,
  })
  permitNumber: string;

  @AutoMap()
  @ApiProperty({
    description: 'DMS Document ID used to retrieve the PDF of the permit',
  })
  @Column({
    name: 'DOCUMENT_ID',
    nullable: true,
  })
  documentId: string;
}
