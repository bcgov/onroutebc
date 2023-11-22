import { Module } from '@nestjs/common';
import { PowerUnitsService } from './power-units.service';
import { PowerUnitsController } from './power-units.controller';
import { PowerUnit } from './entities/power-unit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerUnitsProfile } from './profiles/power-unit.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PowerUnit])],
  controllers: [PowerUnitsController],
  providers: [PowerUnitsService, PowerUnitsProfile],
})
export class PowerUnitsModule {}
