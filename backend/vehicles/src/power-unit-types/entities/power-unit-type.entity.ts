import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { PowerUnit } from '../../power-units/entities/power-unit.entity';

@Entity({ name: 'ORBC_VT_POWER_UNIT_TYPE' })
export class PowerUnitType extends Base {
  @ApiProperty({ example: 'CONCRET', description: 'The Power Unit Type Code' })
  @PrimaryColumn({ length: 7, name: 'TYPE_CODE', nullable: false })
  typeCode: string;

  @ApiProperty({
    example: 'Concrete Pumper Trucks',
    description: 'Power Unit Type',
  })
  @Column({ length: 150, name: 'TYPE', nullable: false })
  type: string;

  @ApiProperty({
    example:
      'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
    description: 'Power Unit Type Description',
  })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: true })
  description: string;

  @ApiProperty({ example: '1', description: 'Sort Order' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @ApiProperty({
    example: '1',
    description: 'Is Active Flag - 1 (Active)/ 0 (Deactive)',
  })
  @Column({ type: 'bit', name: 'IS_ACTIVE', nullable: false })
  isActive: string;

  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.powerUnitType)
  powerUnits: PowerUnit[];
}
