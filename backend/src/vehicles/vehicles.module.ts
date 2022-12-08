import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { PowerUnit } from './entities/powerUnit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PowerUnit])],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule {}
