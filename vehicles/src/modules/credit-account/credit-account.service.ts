import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditAccount } from './entities/credit-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreditAccountService {
  private readonly logger = new Logger(CreditAccountService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(CreditAccount)
    private readonly creditAccountRepository: Repository<CreditAccount>,
  ) {}


  public create() {
    return 'created';
  }

  public close() {
    this.creditAccountRepository.save()
    return 'closed';
  }

  public putOnHold() {
    return 'put on hold';
  }
}
