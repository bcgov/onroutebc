import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditAccountController } from './credit-account.controller';
import { CreditAccountService } from './credit-account.service';
import { CreditAccountActivity } from './entities/credit-account-activity.entity';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { CreditAccount } from './entities/credit-account.entity';
import { CreditAccountUserController } from './credit-account-user.controller';
import { CreditAccountProfile } from './profiles/credit-account.profile';
import { CompanyModule } from '../company-user-management/company/company.module';
import { APP_GUARD } from '@nestjs/core';
import { FeatureFlagGuard } from '../../common/guard/feature-flag.guard';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditAccount,
      CreditAccountActivity,
      CreditAccountUser,
      GarmsExtractFile,
    ]),
    CompanyModule,
  ],
  controllers: [CreditAccountController, CreditAccountUserController],
  providers: [
    CreditAccountService,
    CreditAccountProfile,
    {
      provide: APP_GUARD,
      useClass: FeatureFlagGuard,
    },
  ],
  exports: [CreditAccountService],
})
export class CreditAccountModule {}
