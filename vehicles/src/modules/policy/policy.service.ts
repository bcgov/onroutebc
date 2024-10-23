import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { ReadPolicyConfigurationDto } from './dto/response/read-policy-configuration.dto';
import { PolicyConfiguration } from './entities/policy-configuration.entity';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(PolicyConfiguration)
    private policyConfigurationRepository: Repository<PolicyConfiguration>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @LogAsyncMethodExecution()
  async findAllActive(): Promise<ReadPolicyConfigurationDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.policyConfigurationRepository.find({
        select: { policyJson: true },
        where: { isDraft: false },
      }),
      PolicyConfiguration,
      ReadPolicyConfigurationDto,
    );
  }
}
