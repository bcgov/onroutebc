import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
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
import { ReadCreditAccountUserDto } from './dto/response/read-credit-account-user.dto';
import { ReadCreditAccountDto } from './dto/response/read-credit-account.dto';

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
@Controller('companies/:companyId/credit-account')
export class CreditAccountController {
  constructor(private readonly creditAccountService: CreditAccountService) {}

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
    type: ReadCreditAccountUserDto,
  })
  @ApiBadRequestResponse({
    description: 'The response containing a message of why a request failed.',
    type: String,
  })
  @Post()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  @IsFeatureFlagEnabled('CREDIT-ACCOUNT')
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
   * Retrieves a credit account.
   *
   * @param { companyId } - The companyId path parameter.
   * @returns The result of the creation operation.
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
  @IsFeatureFlagEnabled('CREDIT-ACCOUNT')
  // @Get() - Uncomment when feature is ready
  @Roles(Role.READ_CREDIT_ACCOUNT)
  async getCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<ReadCreditAccountDto> {
    const readCreditAccountDto =
      await this.creditAccountService.getCreditAccount(
        request.user as IUserJWT,
        companyId,
      );
    if (!readCreditAccountDto) {
      throw new DataNotFoundException();
    }
    return readCreditAccountDto;
  }
}
