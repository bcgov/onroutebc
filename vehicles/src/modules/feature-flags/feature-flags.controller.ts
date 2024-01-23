import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiBadRequestResponse, ApiNotFoundResponse, ApiMethodNotAllowedResponse, ApiInternalServerErrorResponse, ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { Roles } from "src/common/decorator/roles.decorator";
import { Role } from "src/common/enum/roles.enum";
import { ExceptionDto } from "src/common/exception/exception.dto";
import { ReadFeatureFlagDto } from "./dto/response/read-feature-flag.dto";
import { FeatureFlagsService } from "./feature-flags.service";


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
    @Roles(Role.STAFF)
    @Get()
    async getFeatureFlags(): Promise<ReadFeatureFlagDto[]> {
        const featureFlags = await this.featureFlagService.findAll();
        return featureFlags;
    }

}