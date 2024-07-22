import { Module } from '@nestjs/common';
import { PolicyConfigService } from './policy-config.service';
import { PolicyConfigController } from './policy-config.controller';
import { PolicyConfig } from './entities/policy-config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyConfigProfile } from './profile/policy-config.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyConfig])],
  controllers: [PolicyConfigController],
  providers: [PolicyConfigService, PolicyConfigProfile],
})
export class PolicyConfigModule {}
