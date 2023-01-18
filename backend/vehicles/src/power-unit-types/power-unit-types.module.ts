import { Module } from '@nestjs/common';
import { PowerUnitTypesService } from './power-unit-types.service';
import { PowerUnitTypesController } from './power-unit-types.controller';
import { PowerUnitType } from './entities/power-unit-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerUnitTypesProfile } from './profiles/power-unit-type.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PowerUnitType])],
  controllers: [PowerUnitTypesController],
  providers: [PowerUnitTypesService, PowerUnitTypesProfile],
})
export class PowerUnitTypesModule {}
