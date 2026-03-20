import { PartialType } from '@nestjs/swagger';
import { CreateCreditAccountDto } from './create-credit-account.dto';

export class UpdateCreditAccountDto extends PartialType(
  CreateCreditAccountDto,
) {}
