import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../users/entities/company-user.entity';
import { UsersModule } from '../users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Company,CompanyUser]), forwardRef(() => UsersModule)],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile],
  exports: [CompanyService],
})
export class CompanyModule {}
