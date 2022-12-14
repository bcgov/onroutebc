import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PowerUnit } from './powerUnit.entity';

@Entity({ name: 'ORT_VT_POWER_UNIT_TYPE' })
export class PowerUnitType extends BaseEntity {
  @ApiProperty({
    example: '1',
    description: 'The Power Unit Type ID',
  })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'TYPE_ID' })
  typeId: number;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type' })
  @Column({ length: 100, name: 'TYPE', nullable: false })
  type: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Description' })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: false })
  description: string;

  @ApiProperty({ example: 'TODO', description: 'Trailer Type Alias' })
  @Column({ length: 50, name: 'ALIAS', nullable: true })
  alias: string;

  @ApiProperty({ example: 'TODO', description: 'Power Unit Type' })
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.powerUnitType)
  powerUnits: PowerUnit[];
}
