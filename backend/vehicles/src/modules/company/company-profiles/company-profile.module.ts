import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileController } from './company-profile.controller';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company-profile.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService, CompanyProfile],
})
export class CompanyProfileModule {}
