import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';

@Entity({ name: 'ORBC_POLICY_CONFIGURATION' })
export class PolicyConfiguration extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the policy configuration.',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'POLICY_CONFIGURATION_ID' })
  policyConfigurationId: string;

  @AutoMap()
  @Column({ length: 8000, name: 'POLICY_JSON', nullable: true })
  policyJson: string;

  @AutoMap()
  @Column({
    insert: false,
    update: false,
    name: 'EFFECTIVE_DATE',
    nullable: true,
    type: 'date',
  })
  effectiveDate: string;

  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_DRAFT',
    nullable: false,
    default: true,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isDraft: boolean;
}
