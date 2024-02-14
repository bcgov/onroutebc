import { Mapper, createMap } from "@automapper/core";
import { FeatureFlag } from "../entities/feature-flag.entity";
import { ReadFeatureFlagDto } from "../dto/response/read-feature-flag.dto";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FeatureFlagsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      
      /**
       * The mapping is between ReadCompanyDto and ReadCompanyUserDto.
       */
      createMap(mapper, FeatureFlag, ReadFeatureFlagDto);

      /**
       * The mapping is between Company and ReadCompanyMetadataDto.
       */
      //createMap(mapper, Company, ReadCompanyMetadataDto);
    };
  }
}
