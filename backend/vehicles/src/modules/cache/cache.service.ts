import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permit } from 'src/modules/permit/entities/permit.entity';
import { Repository } from 'typeorm';
import { PowerUnitTypesService } from '../vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from '../vehicles/trailer-types/trailer-types.service';
import { PermitType } from '../permit/entities/permit-type.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FullNames } from './interface/fullNames.interface';
import { PermitData } from '../pdf/interface/permitData.interface';
import {
  getCountryName,
  getProvinceName,
} from './helpers/getCountryProvinceNames.helper';
import { getPermitTypeName } from './helpers/getPermitTypeName.helper';
import { getVehicleTypeNames } from './helpers/getVehicleTypeNames.helper';
import { CommonService } from '../common/common.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private commonService: CommonService,
    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
  ) {}

  /**
   * Converts code names associated with a permit to full names by calling the ORBC database.
   * Example: 'TROS' to 'Oversize: Term'.
   * @param permit
   * @returns
   */
  public async getFullNamesFromDatabase(permit: Permit): Promise<FullNames> {
    const permitData: PermitData = JSON.parse(permit.permitData.permitData);

    const { vehicleType, vehicleSubType } = await getVehicleTypeNames(
      this.cacheManager,
      permitData,
      this.powerUnitTypeService,
      this.trailerTypeService,
    );

    const mailingCountryCode = await getCountryName(
      this.cacheManager,
      permitData.vehicleDetails.countryCode,
      this.commonService,
    );
    const mailingProvinceCode = await getProvinceName(
      this.cacheManager,
      permitData.vehicleDetails.provinceCode,
      this.commonService,
    );
    const vehicleCountryCode = await getCountryName(
      this.cacheManager,
      permitData.mailingAddress.countryCode,
      this.commonService,
    );
    const vehicleProvinceCode = await getProvinceName(
      this.cacheManager,
      permitData.mailingAddress.provinceCode,
      this.commonService,
    );

    const permitName = await getPermitTypeName(
      this.cacheManager,
      permit.permitType,
      this.permitTypeRepository,
    );

    return {
      vehicleType,
      vehicleSubType,
      mailingCountryCode,
      mailingProvinceCode,
      vehicleCountryCode,
      vehicleProvinceCode,
      permitName,
    };
  }
}
