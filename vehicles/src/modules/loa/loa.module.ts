import { Module } from '@nestjs/common';
import { LoaController } from './loa.controller';
import { LoaService } from './loa.service';
import { LoaDetail } from './entities/loa-detail.entity';
import { LoaPermitType } from './entities/loa-permit-type-details.entity';
import { LoaVehicle } from './entities/loa-vehicles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaProfile } from './profile/loa.profile';

@Module({
  imports: [TypeOrmModule.forFeature([LoaDetail, LoaPermitType, LoaVehicle])],
  controllers: [LoaController],
  providers: [LoaService, LoaProfile],
})
export class LoaModule {}
