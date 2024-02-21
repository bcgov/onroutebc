import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlagsProfile } from './profiles/feature-flags.profile';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlag])],
  controllers: [],
  providers: [FeatureFlagsService, FeatureFlagsProfile],
  exports: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
