import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { SpecialAuthModule } from '@modules/special-auth/special-auth.module';

@Module({
  imports: [SpecialAuthModule],
  controllers: [PolicyController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}
