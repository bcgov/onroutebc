import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PolicyDefinition } from 'onroute-policy-engine/dist/types';

export class ReadPolicyConfigDto {
  /**
   * Unique identifier for the policy configuration.
   */
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the policy configuration.',
  })
  policyConfigId: number;

  /**
   * JSON data representing the policy configuration.
   */
  @AutoMap()
  @ApiProperty({
    description: 'Policy configuration in JSON format.',
  })
  policy: PolicyDefinition;

  /**
   * Configuration effective date.
   */
  @AutoMap()
  @ApiProperty({
    example: '2023-07-13T17:31:17.470Z',
    description: 'Policy Configuration effective date.',
  })
  effectiveDate: string;

  /**
   * Indicates if the configuration is currently a draft version.
   */
  @AutoMap()
  @ApiProperty({
    example: true,
    description: 'Indicates if the configuration is currently a draft.',
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
  changeDescription: string;
}
