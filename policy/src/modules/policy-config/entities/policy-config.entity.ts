import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'ORBC_POLICY_CONFIGURATION', schema: 'dbo' })
export class PolicyConfig extends Base {
  /**
   * Unique identifier for the policy configuration.
   */
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the policy configuration.',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'POLICY_CONFIGURATION_ID' })
  policyConfigId: number;

  /**
   * JSON data representing the policy configuration.
   */
  @AutoMap()
  @Column({ name: 'POLICY_JSON', nullable: true, type: 'simple-json' }) //Full text search capabilities is not required on the field
  policy: JSON;

  /**
   * configuration effective date.
   */
  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'Configuration effective date.',
  })
  @Column({
    name: 'EFFECTIVE_DATE',
    nullable: true,
    type: 'datetime2',
  })
  effectiveDate: Date;

  /**
   * Specifies whether the config is currently active. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_DRAFT',
    default: true,
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isDraft: boolean;

  /**
   * Description of changes made in the configuration.
   */
  @AutoMap()
  @ApiProperty({
    example: 'Initial release of policy configuration with updated rules',
    description: 'Description of changes made in the configuration.',
  })
  @Column({
    name: 'CHANGE_DESCRIPTION',
    nullable: true,
    type: 'nvarchar',
    length: 2000,
  })
  changeDescription: string;
}
