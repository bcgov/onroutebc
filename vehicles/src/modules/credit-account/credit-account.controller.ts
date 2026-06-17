import { Controller, Get, Param, Req } from '@nestjs/common';
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
import { Request } from 'express';
import { IsFeatureFlagEnabled } from '../../common/decorator/is-feature-flag-enabled.decorator';
import { Permissions } from '../../common/decorator/permissions.decorator';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { CreditAccountService } from './credit-account.service';
import { IDIRUserRole } from '../../common/enum/user-role.enum';
import { CreditAccountNumberPathParamDto } from './dto/request/pathParam/creditAccountNumber.path-params.dto';
import { ReadCreditAccountDetailsDto } from './dto/response/read-credit-account-details.dto';

@ApiBearerAuth()
@ApiTags('Credit Accounts - API accessible exclusively to staff users.')
@ApiMethodNotAllowedResponse({
  description: 'The Credit Account Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Credit Account Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiUnprocessableEntityResponse({
  description: 'The Credit Account Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@IsFeatureFlagEnabled('CREDIT-ACCOUNT')
@Controller('credit-accounts')
export class CreditAccountController {
  constructor(private readonly creditAccountService: CreditAccountService) {}
  /**
   * Retrieves credit account details from EGARMS and verifies organization access.
   *
   * @param {Object} params - The request object parameters.
   * @param {string} params.creditAccountNumber - The creditAccountNumber path parameter.
   * @returns {Promise<ReadCreditAccountDetailsDto>} The retrieved credit account details.
   */
  @ApiOperation({
    summary:
      'Retrieves credit account details from EGARMS and verifies ORBC existence.',
    description:
      'Retrieves credit account details from EGARMS and verifies ORBC existence, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved credit account details.',
    type: ReadCreditAccountDetailsDto,
  })
  @Get('/egarms/:creditAccountNumber')
  @Permissions({
    allowedIdirRoles: [IDIRUserRole.FINANCE],
  })
  async getCreditAccountLimit(
    @Req() request: Request,
    @Param() { creditAccountNumber }: CreditAccountNumberPathParamDto,
  ): Promise<ReadCreditAccountDetailsDto> {
    const readCreditAccountLimitDto =
      await this.creditAccountService.getCreditAccountDetailsFromEGARMSandVerifyORBC(
        {
          creditAccountNumber: creditAccountNumber,
          currentUser: request.user as IUserJWT,
          mapBasedonRole: true,
        },
      );
    return readCreditAccountLimitDto;
  }
}
