import { Controller, Get, Param, Req } from '@nestjs/common';
import { PolicyService } from './policy.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { ApplicationIdIdPathParamDto } from '../permit-application-payment/application/dto/request/pathParam/applicationId.path-params.dto';
import { Permissions } from '../../common/decorator/permissions.decorator';
import { ClientUserRole, IDIRUserRole } from '../../common/enum/user-role.enum';
import { ValidationResults } from 'onroute-policy-engine';

@ApiBearerAuth()
@ApiTags('Policy Validation')
@Controller('companies/:companyId/policy')
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
  type: ExceptionDto,
})
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * Validates an application and calculates its cost based on the user's permissions.
   *
   * @param request - The incoming request object, used to extract the user's authentication details.
   * @param { ApplicationIdIdPathParamDto } param - DTO containing companyId and applicationId path parameters.
   * @returns A promise resolved with the validation results and cost for the authenticated user's application.
   */
  @ApiOperation({
    summary: 'Returns the policy engine validation results and cost.',
    description:
      'Returns the policy engine validation results and cost. Output will be of type ValidationResults from policy engine',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Response.',
    type: ExceptionDto,
  })
  //TODO - Issue with import of Valdiation Result
  @ApiOkResponse({
    description: 'The policy engine validation results.',
    type: ValidationResults,
  })
  @Get(':applicationId')
  @Permissions({
    allowedBCeIDRoles: [
      ClientUserRole.PERMIT_APPLICANT,
      ClientUserRole.COMPANY_ADMINISTRATOR,
    ],
    allowedIdirRoles: [
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.CTPO,
    ],
  })
  async validateApplications(
    @Req() request: Request,
    @Param() { companyId, applicationId }: ApplicationIdIdPathParamDto,
  ): Promise<ValidationResults> {
    return await this.policyService.validateApplicationAndCalculateCost({
      companyId,
      applicationId,
    });
  }
}
