import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PowerUnitTypesService } from './modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from './modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from './modules/common/common.service';
import { PermitService } from './modules/permit/permit.service';
import * as fs from 'fs';
import { EmailTemplate } from './common/enum/email-template.enum';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private permitTypeService: PermitService,
    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,
    private commonService: CommonService,
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

    const permitTypes = await this.permitTypeService.findAllPermitTypes();
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

    const assetsPath =
      process.env.NODE_ENV === 'local'
        ? './src/modules/email/assets/'
        : './dist/modules/email/assets/';

    await this.addToCache(
      EmailTemplate.PROFILE_REGISTRATION_EMAIL_TEMPLATE,
      this.convertFiletoString(
        assetsPath + 'templates/profile-registration.email.hbs',
      ),
    );
    await this.addToCache(
      EmailTemplate.ISSUE_PERMIT_EMAIL_TEMPLATE,
      this.convertFiletoString(assetsPath + 'templates/issue-permit.email.hbs'),
    );
    await this.addToCache(
      'orbcEmailStyles',
      this.convertFiletoString(assetsPath + 'styles/orbc-email-styles.css'),
    );
  }

  private convertFiletoString(svgFilePath: string, encode?: string) {
    const file = fs.readFileSync(svgFilePath, 'utf-8');
    if (encode) {
      return Buffer.from(file).toString('base64');
    } else {
      return Buffer.from(file).toString();
    }
  }
}
