import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadPolicyConfigurationDto {
  @AutoMap()
  @ApiProperty({
    description: 'Id of the policy configuration.',
    example: 74,
  })
  policyConfigurationId: number;

  @AutoMap()
  @ApiProperty({
    description: 'The policy config json.',
    required: false,
  })
  policyJson: JSON;

  @AutoMap()
  @ApiProperty({
    description: 'The effective date of the policy config.',
    required: false,
  })
  effectiveDate: string;

  @AutoMap()
  @ApiProperty({
    description: 'Boolean indicator on whether the policy config is a draft.',
    example: false,
    required: false,
  })
  isDraft: boolean;
}
