import { Module } from '@nestjs/common';
import { PowerUnitsService } from './power-units.service';
import { PowerUnitsController } from './power-units.controller';
import { PowerUnit } from './entities/power-unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PowerUnit])],
  controllers: [PowerUnitsController],
  providers: [PowerUnitsService],
})
export class PowerUnitsModule {}
