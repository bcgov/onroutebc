import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
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
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/roles.enum';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { AddToShoppingCartDto } from './dto/request/add-to-shopping-cart.dto';
import { CompanyIdPathParamDto } from './dto/request/pathParam/companyId.path-param.dto';
import { UpdateShoppingCartDto } from './dto/request/update-shopping-cart.dto';
import { ReadShoppingCartDto } from './dto/response/read-shopping-cart.dto';
import { ResultDto } from './dto/response/result.dto';
import { ShoppingCartService } from './shopping-cart.service';
import { GetApplicationInCartQueryParams } from './dto/request/queryParam/getApplicationsInCart.query-param.dto';

@ApiBearerAuth()
@ApiTags('Shopping Cart')
@Controller('companies/:companyId/shopping-cart')
@ApiMethodNotAllowedResponse({
  description: 'The Application Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Application Api Internal Server Error Response',
  type: ExceptionDto,
})
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

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
    type: ResultDto,
  })
  @Post()
  @Roles(Role.WRITE_PERMIT)
  async addToCart(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { applicationIds }: AddToShoppingCartDto,
  ): Promise<ResultDto> {
    return await this.shoppingCartService.addToCart(request.user as IUserJWT, {
      applicationIds,
      companyId,
    });
  }

  /**
   * Retrieves applications within the shopping cart based on the user's permissions and optional query parameters.
   *
   * @param request - The incoming request object, used to extract the user's authentication details.
   * @param companyIdPathParamDto - DTO containing companyId path parameter.
   * @returns A promise resolved with the applications found in the shopping cart for the authenticated user.
   */
  @ApiOperation({
    summary: 'Returns the applications in the shopping cart.',
    description:
      'Returns one or more applications from the shopping cart, enforcing authentication.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Response.',
    type: ExceptionDto,
  })
  @ApiOkResponse({
    description: 'The result of the changes to cart.',
    type: ResultDto,
  })
  @Get()
  @Roles(Role.WRITE_PERMIT)
  async getApplicationsInCart(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Query() { allApplications }: GetApplicationInCartQueryParams,
  ): Promise<ReadShoppingCartDto[]> {
    return await this.shoppingCartService.findApplicationsInCart(
      request.user as IUserJWT,
      companyId,
      allApplications,
    );
  }

  /**
   * Retrieves applications within the shopping cart based on the user's permissions and optional query parameters.
   *
   * @param request - The incoming request object, used to extract the user's authentication details.
   * @param { companyId } - The companyId path parameter.
   * @returns A promise resolved with the applications found in the shopping cart for the authenticated user.
   */
  @ApiOperation({
    summary: 'Returns the number of applications in the shopping cart.',
    description:
      'Returns the number of applications from the shopping cart, enforcing authentication.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request Response.',
    type: ExceptionDto,
  })
  @ApiOkResponse({
    description: 'The result of the changes to cart.',
    type: ResultDto,
  })
  @Get('count')
  @Roles(Role.WRITE_PERMIT)
  async getCartCount(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
  ): Promise<number> {
    return await this.shoppingCartService.getCartCount(
      request.user as IUserJWT,
      companyId,
    );
  }

  /**
   * Removes one or more applications from the shopping cart.
   *
   * @param { companyId } - The companyId path parameter.
   * @param { applicationIds } - The DTO to update a shopping cart.
   * @returns The result of the removal operation.
   */
  @Delete()
  @Roles(Role.WRITE_PERMIT)
  @ApiOperation({
    summary: 'Removes one or more applications from the shopping cart.',
    description:
      'Removes one or more applications from the shopping cart, enforcing authentication.',
  })
  @ApiOkResponse({
    description: 'The result of the changes to cart.',
    type: ResultDto,
    status: 200,
  })
  async removeFromCart(
    @Req() request: Request,
    @Param() { companyId }: CompanyIdPathParamDto,
    @Body() { applicationIds }: UpdateShoppingCartDto,
  ): Promise<ResultDto> {
    return await this.shoppingCartService.remove(request.user as IUserJWT, {
      companyId,
      applicationIds,
    });
  }
}
