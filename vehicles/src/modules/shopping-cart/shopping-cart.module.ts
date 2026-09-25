import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';
import { Permit as Application } from '@modules/permit-application-payment/permit/entities/permit.entity';
import { PermitData as ApplicationData } from '@modules/permit-application-payment/permit/entities/permit-data.entity';
import { PermitType } from '@modules/permit-application-payment/permit/entities/permit-type.entity';
import { ShoppingCartProfile } from './profile/shopping-cart.profile';
import { PolicyModule } from '@modules/policy/policy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationData, PermitType]),
    PolicyModule,
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, ShoppingCartProfile],
})
export class ShoppingCartModule {}
