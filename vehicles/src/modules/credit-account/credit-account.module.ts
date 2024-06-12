import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditAccountService } from './credit-account.service';
import { CreditAccountController } from './credit-account.controller';
import { CreditAccount } from './entities/credit-account.entity';
import { CreditAccountActivity } from './entities/credit-account-activity.entity';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { CreditAccountUserController } from './credit-account-user.controller';
import { CreditAccountProfile } from './profiles/credit-account.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditAccount,
      CreditAccountActivity,
      CreditAccountUser,
    ]),
  ],
  controllers: [CreditAccountController, CreditAccountUserController],
  providers: [CreditAccountService, CreditAccountProfile],
})
export class CreditAccountModule {}
