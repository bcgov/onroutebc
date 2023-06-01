import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PowerUnitTypesService } from './modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from './modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from './modules/common/common.service';
import { Repository } from 'typeorm';
import { PermitType } from './modules/permit/entities/permit-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,

    private commonService: CommonService,

    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
  ) {}

  getHello(): string {
    return 'Vehicles Healthcheck!';
  }

  // TODO: Refactor item structure
  async addToCache(key: string, item: string) {
    await this.cacheManager.set(key, item);
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value as string;
  }

  // TODO: Decide on a cache structure
  async initializeCache() {
    const countries = await this.commonService.findAllCountries();
    for (const country of countries) {
      await this.addToCache(country.countryCode, country.countryName);
    }

    const provinces = await this.commonService.findAllProvinces();
    for (const province of provinces) {
      await this.addToCache(province.provinceCode, province.provinceName);
    }

    const permitTypes = await this.permitTypeRepository.find({});
    for (const permitType of permitTypes) {
      await this.addToCache(permitType.permitTypeId, permitType.name);
    }

    const powerUnitTypes = await this.powerUnitTypeService.findAll();
    for (const pu of powerUnitTypes) {
      await this.addToCache(pu.typeCode, pu.type);
    }

    const trailerTypes = await this.trailerTypeService.findAll();
    for (const trailer of trailerTypes) {
      await this.addToCache(trailer.typeCode, trailer.type);
    }

    await this.addToCache('powerUnit', 'Power Unit');
    await this.addToCache('trailer', 'Trailer');
  }
}
