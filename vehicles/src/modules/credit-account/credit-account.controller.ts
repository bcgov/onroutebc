import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { IsFeatureFlagEnabled } from '../../common/decorator/is-feature-flag-enabled.decorator';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/roles.enum';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { CompanyIdPathParamDto } from '../common/dto/request/pathParam/companyId.path-param.dto';
import { CreditAccountService } from './credit-account.service';
import { CreateCreditAccountDto } from './dto/request/create-credit-account.dto';
import { ReadCreditAccountDto } from './dto/response/read-credit-account.dto';
import { CreditAccountIdPathParamDto } from './dto/request/pathParam/creditAccountUsers.path-params.dto';
import { UpdateCreditAccountStatusDto } from './dto/request/update-credit-account-status.dto';
import { ReadCreditAccountActivityDto } from './dto/response/read-credit-account-activity.dto';
import {
  ClientUserAuthGroup,
  IDIR_USER_AUTH_GROUP_LIST,
  IDIRUserAuthGroup,
} from '../../common/enum/user-auth-group.enum';
import { ReadCreditAccountMetadataDto } from './dto/response/read-credit-account-metadata.dto';
import { ReadCreditAccountLimitDto } from './dto/response/read-credit-account-limit.dto';

@ApiBearerAuth()
@ApiTags('Credit Accounts')
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
@Controller('companies/:companyId/credit-accounts')
export class CreditAccountController {
  constructor(private readonly creditAccountService: CreditAccountService) {}
// dev pr comment
  /**
   * Creates a credit account.
   *
   * @param { companyId } - The companyId path parameter.
   * @returns The result of the creation operation OR a relevant exception.
   */
  @ApiOperation({
    summary: 'Creates a credit account.',
    description: 'Creates a credit account, enforcing authentication.',
  })
  @ApiCreatedResponse({
    description: 'The created credit account.',
    type: ReadCreditAccountDto,
  })
  @ApiBadRequestResponse({
    description: 'The response containing a message of why a request failed.',
    type: String,
  })
  @Post()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async createCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { creditLimit }: CreateCreditAccountDto,
  ): Promise<ReadCreditAccountDto> {
    return await this.creditAccountService.create(request.user as IUserJWT, {
      companyId,
      creditLimit,
    });
  }

  /**
   * Retrieves a credit account metadata.
   *
   * @param { companyId } - The companyId path parameter.
   * @returns The result of the creation operation.
   */
  @ApiOperation({
    summary:
      'Retrieves a credit account (if available) metadata associated with a company.',
    description:
      'Retrieves a credit account (if available) metadata associated with a company, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved credit account.',
    type: ReadCreditAccountMetadataDto,
  })
  @Get()
  @Roles(Role.READ_CREDIT_ACCOUNT)
  async getCreditAccountMetadata(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<ReadCreditAccountMetadataDto> {
    const readCreditAccounMetadataDto =
      await this.creditAccountService.getCreditAccountMetadata({
        companyId,
        currentUser: request.user as IUserJWT,
      });
    if (!readCreditAccounMetadataDto) {
      throw new DataNotFoundException();
    }
    return readCreditAccounMetadataDto;
  }

  /**
   * Retrieves a credit account.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { creditAccountId } - The creditAccountId path parameter.
   * @returns The result of the retrieval operation OR a relevant exception.
   */
  @ApiOperation({
    summary:
      'Retrieves a credit account (if available) associated with a company.',
    description:
      'Retrieves a credit account (if available) associated with a company, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved credit account.',
    type: ReadCreditAccountDto,
  })
  @Get(':creditAccountId')
  @Roles({
    userAuthGroup: [
      ...IDIR_USER_AUTH_GROUP_LIST,
      ClientUserAuthGroup.COMPANY_ADMINISTRATOR,
    ],
    oneOf: [Role.READ_CREDIT_ACCOUNT],
  })
  async getCreditAccount(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
  ): Promise<ReadCreditAccountDto> {
    const readCreditAccountDto =
      await this.creditAccountService.getCreditAccount({
        companyId,
        creditAccountId,
        currentUser: request.user as IUserJWT,
      });
    if (!readCreditAccountDto) {
      throw new DataNotFoundException();
    }
    return readCreditAccountDto;
  }

  /**
   * Retrieves a credit account (if available) limits.
   *
   * @param {Object} params - The path parameters.
   * @param {string} params.companyId - The companyId path parameter.
   * @param {string} params.creditAccountId - The creditAccountId path parameter.
   * @returns {Promise<ReadCreditAccountLimitDto>} The retrieved credit account limits.
   */
  @ApiOperation({
    summary: 'Retrieves a credit account (if available) limits.',
    description:
      'Retrieves a credit account (if available) limits, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved credit account limits.',
    type: ReadCreditAccountLimitDto,
  })
  @Get(':creditAccountId/limits')
  @Roles({
    userAuthGroup: [
      IDIRUserAuthGroup.FINANCE,
      IDIRUserAuthGroup.HQ_ADMINISTRATOR,
      IDIRUserAuthGroup.SYSTEM_ADMINISTRATOR,
      ClientUserAuthGroup.COMPANY_ADMINISTRATOR,
    ],
    oneOf: [Role.READ_CREDIT_ACCOUNT],
  })
  async getCreditAccountLimit(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
  ): Promise<ReadCreditAccountLimitDto> {
    const readCreditAccountLimitDto =
      await this.creditAccountService.getCreditAccountLimit({
        companyId,
        creditAccountId,
        currentUser: request.user as IUserJWT,
      });
    return readCreditAccountLimitDto;
  }

  /**
   * Retrieves a credit account History.
   *
   * @param {Object} params - The path parameters.
   * @param {string} params.companyId - The companyId path parameter.
   * @param {string} params.creditAccountId - The creditAccountId path parameter.
   * @returns {Promise<ReadCreditAccountActivityDto[]>} The retrieved credit account history.
   */
  @ApiOperation({
    summary: 'Retrieves a credit account (if available) history.',
    description:
      'Retrieves a credit account (if available) history, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The retrieved credit account history.',
    isArray: true,
    type: ReadCreditAccountActivityDto,
  })
  @Get(':creditAccountId/history')
  @Roles({
    userAuthGroup: [IDIRUserAuthGroup.FINANCE],
    oneOf: [Role.READ_CREDIT_ACCOUNT],
  })
  async getCreditAccountHistory(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
  ): Promise<ReadCreditAccountActivityDto[]> {
    const readCreditAccountActivityDto =
      await this.creditAccountService.getCreditAccountActivity({
        companyId,
        creditAccountId,
        currentUser: request.user as IUserJWT,
      });
    return readCreditAccountActivityDto;
  }

  /**
   * Updates the status of a credit account user.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { creditAccountId } - The creditAccountId path parameter.
   * @param { creditAccountStatusType, comment } - The DTO containing status type and comment to update a credit account user.
   * @returns The result of the update operation.
   */
  @ApiOperation({
    summary: 'Updates the status of a credit account user.',
    description:
      'Updates the status of a credit account user, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The updated credit account status details.',
    type: ReadCreditAccountDto,
  })
  @Put(':creditAccountId/status')
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async updateCreditAccountStatus(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
    @Body() { creditAccountStatusType, comment }: UpdateCreditAccountStatusDto,
  ): Promise<ReadCreditAccountDto> {
    const currentUser = request.user as IUserJWT;
    return await this.creditAccountService.updateCreditAccountStatus(
      currentUser,
      {
        creditAccountHolderId: companyId,
        creditAccountId,
        statusToUpdateTo: creditAccountStatusType,
        comment: comment,
      },
    );
  }
}
