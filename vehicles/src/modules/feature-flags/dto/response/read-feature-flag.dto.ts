import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

/**
 * JSON representation of response object when retrieving a feature flag.
 */
export class ReadFeatureFlagDto {
    @AutoMap()
    @ApiProperty({
      description: 'The feature_flag ID.',
      example: 1,
    })
    id: number;

    @AutoMap()
    @ApiProperty({
        description: 'The feature_flag key.',
        example: 'COMPANY_SEARCH',
     })
    featureKey: string;

    @AutoMap()
    @ApiProperty({
        description: 'The feature_flag value.',
        example: 'TRUE',
    })
    featureValue: string;
}
