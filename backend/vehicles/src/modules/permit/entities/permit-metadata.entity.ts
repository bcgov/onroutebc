import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import { PermitType } from '../../../common/enum/permit-type.enum';
import { Permit } from './permit.entity';

@Entity({ name: 'permit.ORBC_PERMIT_METADATA' })
export class PermitMetadata extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit metadata.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  permitMetadataId: string;

  @AutoMap(() => Permit)
  @OneToOne(() => Permit, (Permit) => Permit.permitMetadata)
  @JoinColumn({ name: 'PERMIT_ID' })
  permit: Permit;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Id of the company associated with the permit.',
  })
  @Column({ type: 'integer', name: 'COMPANY_ID', nullable: true })
  companyId: number;

  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: PermitType,
    length: 10,
    name: 'PERMIT_TYPE_ID',
    nullable: true,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: "The permit's Application number.",
  })
  @Column({
    insert: false,
    update: false,
    length: '19',
    name: 'APPLICATION_NUMBER',
    nullable: true,
  })
  applicationNumber: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: "The permit's Application number.",
  })
  @Column({ length: '19', name: 'ISSUED_PERMIT_NUMBER', nullable: true })
  issuedPermitNumber: string;
}
