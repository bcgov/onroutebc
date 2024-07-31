import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialAuthService } from './special-auth.service';
import { SpecialAuth } from './entities/special-auth.entity';
import { NoFeeType } from './entities/no-fee-type.entity';
import { SpecialAuthController } from './special-auth.controller';
import { LoaDetail } from './entities/loa-detail.entity';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { LoaController } from './loa.controller';
import { LoaService } from './loa.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialAuth, NoFeeType, LoaDetail,LoaVehicle,LoaPermitType])],
  controllers: [SpecialAuthController,LoaController],
  providers: [SpecialAuthService, LoaService],
})
export class SpecialAuthModule {}
