import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitData as ApplicationData } from '../permit/entities/permit-data.entity';
import { PermitType } from '../permit/entities/permit-type.entity';
import { Permit as Application } from '../permit/entities/permit.entity';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationData, PermitType]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
