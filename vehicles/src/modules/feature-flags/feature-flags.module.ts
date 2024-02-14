import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlagsProfile } from './profiles/feature-flags.profile';


@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlag])],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService, FeatureFlagsProfile],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {
  static forRoot(dataSource: DataSource, cacheManager: Cache): DynamicModule {
    return {
      module: FeatureFlagsModule,
      imports: [TypeOrmModule.forFeature([FeatureFlag])],
      providers: [
        FeatureFlagsService,
        { provide: DataSource, useValue: dataSource },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        FeatureFlagsProfile,
      ],
      controllers: [FeatureFlagsController],
    };
  }
}
