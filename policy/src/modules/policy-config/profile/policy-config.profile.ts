import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PolicyConfig } from '../entities/policy-config.entity';
import { ReadPolicyConfigDto } from '../dto/response/read-policy-config.dto';

@Injectable()
export class PolicyConfigProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        PolicyConfig,
        ReadPolicyConfigDto,
        forMember(
          (d) => d.policy,
          mapFrom((s) => s.policy),
        ),
      );
    };
  }
}
