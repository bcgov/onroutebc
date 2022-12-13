import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerUnit } from './entities/powerUnit.entity';
import { ProvinceState } from './entities/provinceState.entity';
import { Country } from './entities/country.entity';
import { PowerUnitType } from './entities/powerUnitType.entity';
import { TrailerType } from './entities/trailerType.entity';
import { Trailer } from './entities/trailer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country,ProvinceState,PowerUnitType,PowerUnit,TrailerType,Trailer])],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}
