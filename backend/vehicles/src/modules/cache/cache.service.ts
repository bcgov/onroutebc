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
import { Country } from '../common/entities/country.entity';
import { Province } from '../common/entities/province.entity';
import { formatCountry, formatProvince } from './helpers/formatCountryProvince.helper';
import { formatPermitType } from './helpers/formatPermitType.helper';
import { formatVehicleTypes } from './helpers/formatVehicleTypes.helper';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
  ) {}

  /**
   * Converts code names to full names by calling the ORBC database.
   * Example: 'TROS' to 'Oversize: Term'
   * @param permit
   * @returns
   */
  public async getFullNamesFromDatabase(permit: Permit): Promise<FullNames> {
    const permitData: PermitData = JSON.parse(permit.permitData.permitData);

    const { vehicleType, vehicleSubType } = await formatVehicleTypes(
      this.cacheManager,
      permitData,
      this.powerUnitTypeService,
      this.trailerTypeService,
    );

    const mailingCountryCode = await formatCountry(
      this.cacheManager,
      permitData.vehicleDetails.countryCode,
      this.countryRepository,
    );
    const mailingProvinceCode = await formatProvince(
      this.cacheManager,
      permitData.vehicleDetails.provinceCode,
      this.provinceRepository,
    );
    const vehicleCountryCode = await formatCountry(
      this.cacheManager,
      permitData.mailingAddress.countryCode,
      this.countryRepository,
    );
    const vehicleProvinceCode = await formatProvince(
      this.cacheManager,
      permitData.mailingAddress.provinceCode,
      this.provinceRepository,
    );

    const permitName = await formatPermitType(
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
