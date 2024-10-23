import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyConfiguration } from './entities/policy-configuration.entity';
import { PolicyService } from './policy.service';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyConfiguration])],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyConfigurationModule {}
