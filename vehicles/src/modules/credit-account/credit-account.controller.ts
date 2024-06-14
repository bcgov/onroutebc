import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/roles.enum';
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
   * @returns The result of the creation operation.
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
   * Adds a new item to the shopping cart.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { applicationIds } - The DTO to create a new shopping cart item.
   * @returns The result of the creation operation.
   */
  @ApiOperation({
    summary: 'Adds one or more applications to the shopping cart.',
    description:
      'Adds one or more applications to the shopping cart, enforcing authentication.',
  })
  @ApiCreatedResponse({
    description: 'The result of the changes to cart.',
    type: String,
  })
  @Get()
  @Roles(Role.READ_CREDIT_ACCOUNT)
  async getCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<ReadCreditAccountDto> {
    return await this.creditAccountService.getCreditAccount(
      request.user as IUserJWT,
      companyId,
    );
  }
}
