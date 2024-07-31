import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { SpecialAuth } from './entities/special-auth.entity';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';

export class SpecialAuthService {
  private readonly logger = new Logger(SpecialAuthService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(SpecialAuth)
    private specialAuthRepository: Repository<SpecialAuth>,
  ) {}

  @LogAsyncMethodExecution()
  async findOne(companyId: number): Promise<SpecialAuth> {
    return await this.specialAuthRepository.findOne({
      where: {
        company: { companyId: companyId },
      },
      relations: ['company'],
    });
  }
}
