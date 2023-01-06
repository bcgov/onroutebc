import { Module } from '@nestjs/common';
import { PowerUnitTypesService } from './power-unit-types.service';
import { PowerUnitTypesController } from './power-unit-types.controller';
import { PowerUnitType } from './entities/power-unit-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PowerUnitType])],
  controllers: [PowerUnitTypesController],
  providers: [PowerUnitTypesService],
})
export class PowerUnitTypesModule {}
