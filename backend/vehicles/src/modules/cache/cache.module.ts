import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from './cache.service';
import { PermitType } from '../permit/entities/permit-type.entity';
import { PowerUnitTypesModule } from '../vehicles/power-unit-types/power-unit-types.module';
import { TrailerTypesModule } from '../vehicles/trailer-types/trailer-types.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermitType]),
    PowerUnitTypesModule,
    TrailerTypesModule,
    CommonModule,
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
