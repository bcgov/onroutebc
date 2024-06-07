import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { CreditAccountService } from './credit-account.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { Role } from '../../common/enum/roles.enum';
import { Roles } from '../../common/decorator/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';
import { CompanyIdPathParamDto } from '../shopping-cart/dto/request/pathParam/companyId.path-param.dto';
import { CreateCreditAccountDto } from './dto/request/create-credit-account.dto';

@ApiBearerAuth()
@ApiTags('Shopping Cart')
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
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
  async addToCart(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { creditLimit }: CreateCreditAccountDto,
  ): Promise<string> {
    return await this.creditAccountService.create();
  }
}
