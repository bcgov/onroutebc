import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditAccountDto } from './create-credit-account.dto';

export class UpdateCreditAccountDto extends PartialType(
  CreateCreditAccountDto,
) {}
