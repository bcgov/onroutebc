import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LogAsyncMethodExecution } from "src/common/decorator/log-async-method-execution.decorator";
import { Repository } from "typeorm";
import { ReadFeatureFlagDto } from "./dto/response/read-feature-flag.dto";
import { FeatureFlag } from "./entities/feature-flag.entity";


@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureFlagRepository: Repository<FeatureFlag>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  /**
   * The findAll() method returns an array of ReadFeatureFlagDto objects.
   * It retrieves the entities from the database using the Repository, 
   * maps it to a DTO object using the Mapper, and returns it.
   *
   * @returns The feature flag list as a promise of type {@link ReadFeatureFlagDto}
   */
  @LogAsyncMethodExecution()
  async findAll(): Promise<ReadFeatureFlagDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.featureFlagRepository.find(),
      FeatureFlag,
      ReadFeatureFlagDto,
    );
  }
}
