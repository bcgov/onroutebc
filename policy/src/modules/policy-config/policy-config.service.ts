import { Injectable, Logger } from '@nestjs/common';
import { PolicyConfig } from './entities/policy-config.entity';
import { Mapper } from '@automapper/core';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Nullable } from '../../types/common';
import { ReadPolicyConfigDto } from './dto/response/read-policy-config.dto';

@Injectable()
export class PolicyConfigService {
  private readonly logger = new Logger(PolicyConfigService.name);
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(PolicyConfig)
    private readonly policyConfigRepository: Repository<PolicyConfig>,
  ) {}

  /**
   * Retrieves all active policy configurations based on the provided conditions.
   *
   * @param {Nullable<boolean>} isCurrent - If true, only current active policies are returned based on the effective date.
   * @returns {Promise<ReadPolicyConfigDto[]>} - A promise that resolves to an array of ReadPolicyConfigDto objects.
   */
  async findAllActive(
    isCurrent?: Nullable<boolean>,
  ): Promise<ReadPolicyConfigDto[]> {
    const policyConfigQB =
      this.policyConfigRepository.createQueryBuilder('policy');
    policyConfigQB.where('policy.isDraft = :isDraft', { isDraft: 'N' });
    if (isCurrent) {
      const currentUTCDate = new Date().toISOString();
      policyConfigQB
        .andWhere('policy.effectiveDate <= :effectiveDate', {
          effectiveDate: currentUTCDate,
        })
        .orderBy('policy.effectiveDate', 'DESC')
        .addOrderBy('policy.policyConfigId', 'DESC')
        .limit(1);
    } else {
      policyConfigQB
        .orderBy('policy.effectiveDate', 'DESC')
        .addOrderBy('policy.policyConfigId', 'DESC');
    }
    return this.classMapper.mapArrayAsync(
      await policyConfigQB.getMany(),
      PolicyConfig,
      ReadPolicyConfigDto,
    );
  }

  /**
   * Retrieves all draft policy configurations.
   *
   * @returns {Promise<ReadPolicyConfigDto[]>} - A promise that resolves to an array of ReadPolicyConfigDto objects.
   */
  async findAllDraft(): Promise<ReadPolicyConfigDto[]> {
    const policyConfigQB =
      this.policyConfigRepository.createQueryBuilder('policy');
    policyConfigQB.where('policy.isDraft = :isDraft', { isDraft: 'Y' });
    policyConfigQB
      .orderBy('policy.effectiveDate', 'DESC')
      .addOrderBy('policy.policyConfigId', 'DESC');

    return this.classMapper.mapArrayAsync(
      await policyConfigQB.getMany(),
      PolicyConfig,
      ReadPolicyConfigDto,
    );
  }

  /**
   * Retrieves a policy configuration based on the provided policyConfigId.
   *
   * @param {number} policyConfigId - The ID of the policy configuration to retrieve.
   * @returns {Promise<ReadPolicyConfigDto>} - A promise that resolves to a ReadPolicyConfigDto object.
   */
  async findOne(policyConfigId: number): Promise<ReadPolicyConfigDto> {
    const policyConfigQB =
      this.policyConfigRepository.createQueryBuilder('policy');
    policyConfigQB.where('policy.policyConfigId = :policyConfigId', {
      policyConfigId,
    });
    return this.classMapper.mapAsync(
      await policyConfigQB.getOne(),
      PolicyConfig,
      ReadPolicyConfigDto,
    );
  }
}
