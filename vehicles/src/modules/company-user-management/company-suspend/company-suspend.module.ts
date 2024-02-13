import { Module } from '@nestjs/common';
import { CompanySuspendService } from './company-suspend.service';
import { CompanySuspendController } from './company-suspend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { CompanySuspendProfile } from './profiles/company-suspend.profile';
import { CompanySuspendActivity } from './entities/company-suspend-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanySuspendActivity]), CompanyModule],
  controllers: [CompanySuspendController],
  providers: [CompanySuspendService, CompanySuspendProfile],
})
export class CompanySuspendModule {}
