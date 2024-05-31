import { Module } from '@nestjs/common';
import { CreditAccountService } from './credit-account.service';
import { CreditAccountController } from './credit-account.controller';

@Module({
  controllers: [CreditAccountController],
  providers: [CreditAccountService],
})
export class CreditAccountModule {}
