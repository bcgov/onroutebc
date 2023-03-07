import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UsersModule } from '../users/users.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyProfile } from './profiles/company.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UsersModule, CommonModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile],
})
export class CompanyModule {}
