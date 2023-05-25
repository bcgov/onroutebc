import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from './cache.service';
import { PermitType } from '../permit/entities/permit-type.entity';
import { PowerUnitTypesModule } from '../vehicles/power-unit-types/power-unit-types.module';
import { TrailerTypesModule } from '../vehicles/trailer-types/trailer-types.module';
import { Country } from '../common/entities/country.entity';
import { Province } from '../common/entities/province.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Province, PermitType]),
    PowerUnitTypesModule,
    TrailerTypesModule,
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
