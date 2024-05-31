import { Injectable } from '@nestjs/common';
import { CreateCreditAccountDto } from './dto/create-credit-account.dto';
import { UpdateCreditAccountDto } from './dto/update-credit-account.dto';

@Injectable()
export class CreditAccountService {
  create(createCreditAccountDto: CreateCreditAccountDto) {
    return 'This action adds a new creditAccount';
  }

  findAll() {
    return `This action returns all creditAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditAccount`;
  }

  update(id: number, updateCreditAccountDto: UpdateCreditAccountDto) {
    return `This action updates a #${id} creditAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditAccount`;
  }
}
