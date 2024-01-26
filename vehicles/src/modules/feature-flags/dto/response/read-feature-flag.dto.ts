import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FeatureFlagValue } from 'src/common/enum/feature-flag-value.enum';

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
    @IsEnum(FeatureFlagValue)
    @ApiProperty({
        description: 'The feature_flag value.',
        example: 'ENABLED',
    })
    featureValue: FeatureFlagValue;
}
