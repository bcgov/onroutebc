import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { PermitMetadata } from './permit-metadata.entity';

@Entity({ name: 'permit.ORBC_PERMIT' })
export class Permit extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'PERMIT_ID' })
  permitId: string;

  @AutoMap()
  @Column({ length: 4000, name: 'PERMIT_DATA', nullable: true })
  permitData: string;

  @AutoMap()
  @ApiProperty({ example: 'CWJR897665', description: 'Permit Number.' })
  @Column({
    insert: false,
    update: false,
    length: 20,
    name: 'PERMIT_NUMBER',
    nullable: true,
  })
  permitNumber: string;

  @AutoMap(() => PermitMetadata)
  @OneToOne(() => PermitMetadata, (PermitMetadata) => PermitMetadata.permit, {
    cascade: true,
  })
  permitMetadata: PermitMetadata;
}
