import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
import { ReadFeatureFlagDto } from './dto/response/read-feature-flag.dto';
import { FeatureFlagsService } from './feature-flags.service';
import { AuthOnly } from 'src/common/decorator/auth-only.decorator';

@ApiTags('Configuration - Feature Flags')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The FeatureFlag Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The FeatureFlag Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The FeatureFlag Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagService: FeatureFlagsService) {}

  /**
   * A GET method defined with the @Get() decorator and a route of /feature-flags
   * that retrieves the feature flags data.
   *
   * @returns The featureFlags with response object {@link ReadFeatureFlagDto}.
   */
  @ApiOkResponse({
    description: 'The FeatureFlag Resource',
    type: ReadFeatureFlagDto,
    isArray: true,
  })
  @AuthOnly()
  @Get()
  async getFeatureFlags(): Promise<Map<string, string>> {
    return await this.featureFlagService.findAllFromCache();
  }
}
