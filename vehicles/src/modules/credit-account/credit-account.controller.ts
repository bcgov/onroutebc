import { Body, Controller, Param, Post, Req } from '@nestjs/common';
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
import { CompanyIdPathParamDto } from '../shopping-cart/dto/request/pathParam/companyId.path-param.dto';
import { CreditAccountService } from './credit-account.service';
import { CreateCreditAccountDto } from './dto/request/create-credit-account.dto';

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
  @Post()
  @Roles()
  async createCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { creditLimit }: CreateCreditAccountDto,
  ): Promise<string> {
    return await this.creditAccountService.create();
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
  @Post('close')
  @Roles()
  async closeCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { creditLimit }: CreateCreditAccountDto,
  ): Promise<string> {
    return await this.creditAccountService.close(
      request.user as IUserJWT,
      companyId,
    );
  }

  /**
   * Adds a new item to the shopping cart.
   *
   * @param { companyId } - The companyId path parameter.
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
  @Post('hold')
  @Roles()
  async putOnHoldCreditAccount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<string> {
    return await this.creditAccountService.putOnHold(
      request.user as IUserJWT,
      companyId,
    );
  }
}
