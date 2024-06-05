import { Controller } from '@nestjs/common';
import { CreditAccountService } from './credit-account.service';

@Controller('credit-account')
export class CreditAccountController {
  constructor(private readonly creditAccountService: CreditAccountService) {}
}
