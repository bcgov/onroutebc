import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../common/decorator/roles.decorator';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';

import { CreditAccountService } from './credit-account.service';
import { Role } from '../../common/enum/roles.enum';
import { creditAccountIdPathParamDto } from './dto/request/pathParam/creditAccountUsers.path-params.dto';
import { CreateCreditAccountUserDto } from './dto/request/create-credit-account-user.dto';
import { DeleteCreditAccountUserDto } from './dto/request/delete-credit-account-user.dto';
import { DeleteDto } from '../common/dto/response/delete.dto';

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
    type: String,
  })
  @Put()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async addOrActivateCreditAccountUser(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: creditAccountIdPathParamDto,
    @Body() createCreditAccountUserDto: CreateCreditAccountUserDto,
  ): Promise<string> {
    //TODO : ORV2-2296 Return the proper output
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
  @ApiCreatedResponse({
    description: 'The result of the changes to the credit account user.',
    type: String,
  })
  @Delete()
  @Roles(Role.WRITE_CREDIT_ACCOUNT)
  async deactivateCreditAccountUser(
    @Req() request: Request,
    @Param() { companyId, creditAccountId }: creditAccountIdPathParamDto,
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
}
