/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/roles.enum';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { ShoppingCartService } from './shopping-cart.service';
import { GetShoppingCartQueryParamsDto } from './dto/request/getShoppingCart.query-params.dto';

@ApiBearerAuth()
@ApiTags('Shopping Cart')
@Controller('/permit/applications/shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post()
  @Roles(Role.WRITE_PERMIT)
  create(@Body() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Get()
  @Roles(Role.WRITE_PERMIT)
  findAll(
    @Query() getShoppingCartQueryParamsDto: GetShoppingCartQueryParamsDto,
  ) {
    const { companyId } = getShoppingCartQueryParamsDto;
    return this.shoppingCartService.findAll();
  }

  @Delete()
  @Roles(Role.WRITE_PERMIT)
  remove(@Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.remove(updateShoppingCartDto);
  }
}
