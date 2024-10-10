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
import { Permissions } from '../../common/decorator/permissions.decorator';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { DeleteDto } from '../common/dto/response/delete.dto';
import { CreditAccountService } from './credit-account.service';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { CreditAccountIdPathParamDto } from './dto/request/pathParam/creditAccountUsers.path-params.dto';
import { GetCreditAccountUserQueryParamsDto } from './dto/request/queryParam/getCreditAccountUser.query-params.dto';
import { ReadCreditAccountUserDto } from './dto/response/read-credit-account-user.dto';
import { IsFeatureFlagEnabled } from '../../common/decorator/is-feature-flag-enabled.decorator';
import { ClientUserRole, IDIRUserRole } from '../../common/enum/user-role.enum';

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
@ApiUnprocessableEntityResponse({
  description: 'The Credit Account User Entity could not be processed.',
  type: ExceptionDto,
})
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@IsFeatureFlagEnabled('CREDIT-ACCOUNT')
@Controller(
  'companies/:companyId/credit-accounts/:creditAccountId/credit-account-users',
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
  @ApiOkResponse({
    description: 'The result of the changes to the credit account user.',
    type: ReadCreditAccountUserDto,
  })
  @Put()
  @Permissions({ allowedIdirRoles: [IDIRUserRole.FINANCE] })
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
  @Permissions({ allowedIdirRoles: [IDIRUserRole.FINANCE] })
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
  @Permissions({
    allowedBCeIDRoles: [ClientUserRole.COMPANY_ADMINISTRATOR],
    allowedIdirRoles: [
      IDIRUserRole.PPC_CLERK,
      IDIRUserRole.SYSTEM_ADMINISTRATOR,
      IDIRUserRole.FINANCE,
      IDIRUserRole.CTPO,
      IDIRUserRole.HQ_ADMINISTRATOR,
    ],
  })
  async getCreditAccountUsers(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: CreditAccountIdPathParamDto,
    @Query() { includeAccountHolder }: GetCreditAccountUserQueryParamsDto,
  ): Promise<ReadCreditAccountUserDto[]> {
    const currentUser = request.user as IUserJWT;
    return await this.creditAccountService.getCreditAccountUsers({
      companyId,
      creditAccountId,
      currentUser,
      includeAccountHolder,
    });
  }
}
