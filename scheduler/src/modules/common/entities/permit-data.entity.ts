import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Permit } from './permit.entity';
import { Base } from './base.entity';

@Entity({ name: 'permit.ORBC_PERMIT_DATA' })
export class PermitData extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the permit Data.',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  permitDataId: string;

  @AutoMap(() => Permit)
  @OneToOne(() => Permit, (Permit) => Permit.permitData)
  @JoinColumn({ name: 'PERMIT_ID' })
  permit: Permit;

  @AutoMap()
  @Index({ fulltext: true })
  @Column({ length: 4000, name: 'PERMIT_DATA', nullable: true })
  permitData: string;

  @AutoMap()
  @Column({
    insert: false,
    update: false,
    name: 'START_DATE',
    nullable: true,
    type: 'date',
  })
  startDate: string;

  @AutoMap()
  @Column({
    insert: false,
    update: false,
    name: 'EXPIRY_DATE',
    nullable: true,
    type: 'date',
  })
  expiryDate: string;

  @AutoMap()
  @Column({ name: 'UNIT_NUMBER', insert: false, update: false })
  unitNumber: string;

  @AutoMap()
  @Column({ name: 'PLATE', insert: false, update: false })
  plate: string;

  @AutoMap()
  @Column({ name: 'VIN', insert: false, update: false })
  vin: string;
}
