import { ReadFeatureFlagDto } from 'src/modules/feature-flags/dto/response/read-feature-flag.dto';
import * as constants from './test-data.constants';

export const readFeatureFlagDtoMock: ReadFeatureFlagDto = {
  featureId: constants.FEATURE_ID,
  featureKey: constants.FEATURE_KEY,
  featureValue: constants.FEATURE_VALUE,
};
