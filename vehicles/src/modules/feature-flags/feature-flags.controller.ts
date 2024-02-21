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
   * Accessible via GET method on the /feature-flags route, it fetches and returns
   * the current state of feature flags, cached within the service.
   *
   * @returns The state of feature flags in a stringified format, where each flag's name
   * is a key, and its enabled/disabled state is the value.
   */
  @ApiOkResponse({
    description: 'The FeatureFlag Resource',
    type: Object,
  })
  @AuthOnly()
  @Get()
  async getFeatureFlags(): Promise<string> {
    return await this.featureFlagService.findAllFromCache();
  }
}
