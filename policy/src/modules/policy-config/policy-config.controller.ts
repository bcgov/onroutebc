import { Controller, Get, Param, Query } from '@nestjs/common';
import { PolicyConfigService } from './policy-config.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../exception/exception.dto';
import { IsFeatureFlagEnabled } from '../../decorator/is-feature-flag-enabled.decorator';
import { GetPolicyConfigQueryParamsDto } from './dto/request/queryParam/get-policy-config.query-params.dto';
import { Permissions } from '../../decorator/permissions.decorator';
import { PolicyConfigIdPathParamDto } from './dto/request/pathParam/policy-config.path-params.dto';
import { Claim } from '../../enum/claims.enum';
import { ReadPolicyConfigDto } from './dto/response/read-policy-config.dto';
import { AuthOnly } from '../../decorator/auth-only.decorator';

@ApiBearerAuth()
@ApiTags('Policy Configuration')
@ApiMethodNotAllowedResponse({
  description: 'The Policy Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Policy Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The Policy Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@IsFeatureFlagEnabled('POLICY-CONFIG')
@Controller('policy-configurations')
export class PolicyConfigController {
  constructor(private readonly policyConfigService: PolicyConfigService) {}

  /**
   * Retrieves active policy configurations.
   *
   * @param {GetPolicyConfigQueryParamsDto} query - The query parameters.
   * @returns A promise that resolves to an array of active policy configurations.
   */
  @ApiOperation({
    summary: 'Retrieves active policy configurations.',
    description: 'Retrieves active policy configurations.',
  })
  @ApiOkResponse({
    description: 'The retrieved active policy configurations.',
    type: ReadPolicyConfigDto,
    isArray: true,
  })
  @AuthOnly()
  @Get()
  async findAllActive(
    @Query()
    { isCurrent }: GetPolicyConfigQueryParamsDto,
  ): Promise<ReadPolicyConfigDto[]> {
    return await this.policyConfigService.findAllActive(isCurrent);
  }

  /**
   * Retrieves draft policy configurations.
   *
   * @returns A promise that resolves to an array of draft policy configurations.
   */
  @ApiOperation({
    summary: 'Retrieves draft policy configurations.',
    description:
      'Retrieves draft policy configurations, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved draft policy configurations.',
    type: ReadPolicyConfigDto,
    isArray: true,
  })
  @Permissions({ claim: Claim.READ_POLICY_CONFIG })
  @Get('/draft')
  async findAllDraft(): Promise<ReadPolicyConfigDto[]> {
    return await this.policyConfigService.findAllDraft();
  }

  /**
   * Retrieves a specific policy configuration inlcuding draft policy.
   *
   * @param {PolicyConfigIdPathParamDto} params - The path parameters containing the policyConfigId.
   * @returns A promise that resolves to a policy configuration.
   */
  @ApiOperation({
    summary:
      'Retrieves a specific policy configuration inlcuding draft policy.',
    description:
      'Retrieves a specific policy configuration by its ID, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved draft policy configuration.',
    type: ReadPolicyConfigDto,
  })
  @Permissions({ claim: Claim.READ_POLICY_CONFIG })
  @Get(':policyConfigId')
  async findOne(
    @Param() { policyConfigId }: PolicyConfigIdPathParamDto,
  ): Promise<ReadPolicyConfigDto> {
    return await this.policyConfigService.findOne(policyConfigId);
  }
}
