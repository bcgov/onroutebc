import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';
import { Permit as Application } from '../permit-application-payment/permit/entities/permit.entity';
import { PermitData as ApplicationData } from '../permit-application-payment/permit/entities/permit-data.entity';
import { PermitType } from '../permit-application-payment/permit/entities/permit-type.entity';
import { ShoppingCartProfile } from './profile/shopping-cart.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationData, PermitType]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, ShoppingCartProfile],
})
export class ShoppingCartModule {}
