import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiMethodNotAllowedResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/exception/exception.dto';
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
   * Retrieves the current state of feature flags.
   *
   * It is accessible via the GET method on the `/feature-flags` route. This method fetches
   * and returns the current state of feature flags, cached within the service, wherein each
   * flag's name is a key in the returned object, and its enabled/disabled state is represented
   * as the value in string format.
   *
   * @returns A Promise that resolves to an object with feature flag names as keys and their
   * enabled/disabled states as string values.
   */
  @ApiOkResponse({
    description: 'The FeatureFlag Resource',
    type: Object,
  })
  @ApiOperation({
    summary: 'Retrieve Feature Flags',
    description: 'Fetches and returns the current state of all feature flags.',
  })
  @AuthOnly()
  @Get()
  async getFeatureFlags(): Promise<Record<string, string>> {
    return await this.featureFlagService.findAllFromCache();
  }
}
