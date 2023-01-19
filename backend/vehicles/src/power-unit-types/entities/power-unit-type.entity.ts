import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { PowerUnit } from '../../power-units/entities/power-unit.entity';

@Entity({ name: 'ORBC_VT_POWER_UNIT_TYPE' })
export class PowerUnitType extends Base {
  @AutoMap()
  @ApiProperty({ example: 'CONCRET', description: 'Unique identifier of the power unit type.' })
  @PrimaryColumn({ length: 7, name: 'TYPE_CODE', nullable: false })
  typeCode: string;

  @AutoMap()
  @ApiProperty({
    example: 'Concrete Pumper Trucks',
    description: 'Short description of the power unit type.',
  })
  @Column({ length: 150, name: 'TYPE', nullable: false })
  type: string;

  @AutoMap()
  @ApiProperty({
    example:
      'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
    description: 'Long description of the power unit type.',
  })
  @Column({ length: 500, name: 'DESCRIPTION', nullable: true })
  description: string;

  @AutoMap()
  @ApiProperty({ example: '1', description: 'Order that the type should be presented in user interfaces.' })
  @Column({ type: 'integer', name: 'SORT_ORDER', nullable: true })
  sortOrder: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Is Active Flag - 1 (Active)/ 0 (Deactive)',
  })
  @Column({ type: 'bit', name: 'IS_ACTIVE', nullable: false, default: 1 })
  isActive: string;

  @AutoMap(() => [PowerUnit])
  @OneToMany(() => PowerUnit, (PowerUnit) => PowerUnit.powerUnitType)
  powerUnits: PowerUnit[];
}
