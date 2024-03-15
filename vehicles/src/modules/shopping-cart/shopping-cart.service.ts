/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { ApplicationService } from '../permit/application.service';

@Injectable()
export class ShoppingCartService {
  private readonly applicationService:ApplicationService;
  constructor(
    @Inject(ApplicationService)
    applicationService: ApplicationService,
  ) {
    this.applicationService = applicationService;
  }
  create(createShoppingCartDto: CreateShoppingCartDto) {
    
  }

  findAll() {
    return `This action returns all shoppingCart`;
  }

  remove({ applicationIds, companyId }: UpdateShoppingCartDto) {
    this.applicationService.update()
  }
}
