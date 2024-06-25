import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../common/decorator/roles.decorator';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';

import { Role } from '../../common/enum/roles.enum';
import { DeleteDto } from '../common/dto/response/delete.dto';
import { CreditAccountService } from './credit-account.service';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { CreditAccountIdPathParamDto } from './dto/request/pathParam/creditAccountUsers.path-params.dto';
import { GetCreditAccountUserQueryParamsDto } from './dto/request/queryParam/getCreditAccountUser.query-params.dto';
import { ReadCreditAccountUserDto } from './dto/response/read-credit-account-user.dto';
import { IsFeatureFlagEnabled } from '../../common/decorator/is-feature-flag-enabled.decorator';

@ApiBearerAuth()
@ApiTags('Credit Account Users')
@ApiMethodNotAllowedResponse({
  description: 'The Credit Account Users Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Credit Account Users Api Internal Server Error Response',
  type: ExceptionDto,
})
@IsFeatureFlagEnabled('CREDIT-ACCOUNT')
@Controller(
  'companies/:companyId/credit-account/:creditAccountId/credit-account-user',
)
export class CreditAccountUserController {
  constructor(private readonly creditAccountService: CreditAccountService) {}

  /**
   * Adds or activates a credit account user.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { creditAccountId } - The creditAccountId path parameter.
   * @param { createCreditAccountUserDto } - The DTO to create or activate a credit account user.
   * @returns The result of the creation or activation operation.
   */
  @ApiOperation({
    summary: 'Adds or activates a credit account user.',
    description:
      'Adds or activates a credit account user, enforcing authentication.',
  })
  @ApiCreatedResponse({
    description: 'The result of the changes to the credit account user.',
    type: ReadCreditAccountUserDto,
  })
  @Put()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async addOrActivateCreditAccountUser(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
    @Body() createCreditAccountUserDto: CreateCreditAccountUserDto,
  ): Promise<ReadCreditAccountUserDto> {
    const currentUser = request.user as IUserJWT;
    return await this.creditAccountService.addOrActivateCreditAccountUser(
      currentUser,
      companyId,
      creditAccountId,
      createCreditAccountUserDto,
    );
  }

  /**
   * Deactivates one or more credit account user.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { creditAccountId } - The creditAccountId path parameter.
   * @param { deleteCreditAccountUserDto } - The DTO to deactivate a credit account user.
   * @returns The result of the deactivation operation.
   */
  @ApiOperation({
    summary: 'Deactivates one or more credit account user.',
    description:
      'Deactivates one or more credit account user, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The result of the delete operation of credit account user.',
    type: DeleteDto,
  })
  @Delete()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async deactivateCreditAccountUser(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
    @Body() deleteCreditAccountUserDto: DeleteCreditAccountUserDto,
  ): Promise<DeleteDto> {
    const currentUser = request.user as IUserJWT;
    return await this.creditAccountService.deactivateCreditAccountUser(
      currentUser,
      companyId,
      creditAccountId,
      deleteCreditAccountUserDto,
    );
  }

  /**
   * Retrieves credit account users.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { creditAccountId } - The creditAccountId path parameter.
   * @returns List of credit account users.
   */
  @ApiOperation({
    summary: 'Retrieves credit account users and the holder.',
    description:
      'Fetches a list of credit account users and the holder for the specified credit account, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The list of credit account users.',
    type: [ReadCreditAccountUserDto],
  })
  @Get()
  @Roles(Role.READ_CREDIT_ACCOUNT)
  async getCreditAccountUsers(
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
    @Query() { includeAccountHolder }: GetCreditAccountUserQueryParamsDto,
  ): Promise<ReadCreditAccountUserDto[]> {
    return await this.creditAccountService.getCreditAccountUsers(
      companyId,
      creditAccountId,
      includeAccountHolder,
    );
  }
}
