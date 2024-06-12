import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditAccountController } from './credit-account.controller';
import { CreditAccountService } from './credit-account.service';
import { CreditAccountActivity } from './entities/credit-account-activity.entity';
import { CreditAccountUser } from './entities/credit-account-user.entity';
import { CreditAccount } from './entities/credit-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreditAccount,
      CreditAccountActivity,
      CreditAccountUser,
    ]),
  ],
  controllers: [CreditAccountController],
  providers: [CreditAccountService],
})
export class CreditAccountModule {}
