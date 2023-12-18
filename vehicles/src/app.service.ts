import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PowerUnitTypesService } from './modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from './modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from './modules/common/common.service';
import { PermitService } from './modules/permit/permit.service';
import * as fs from 'fs';
import { CacheKey } from './common/enum/cache-key.enum';
import { addToCache, createCacheMap } from './common/helper/cache.helper';
import { PaymentService } from './modules/payment/payment.service';
import { LogMethodExecution } from './common/decorator/log-method-execution.decorator';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private permitTypeService: PermitService,
    private powerUnitTypeService: PowerUnitTypesService,
    private trailerTypeService: TrailerTypesService,
    private commonService: CommonService,
    private paymentService: PaymentService,
  ) {}

  getHello(): string {
    return 'Vehicles Healthcheck!';
  }

  @LogMethodExecution()
  async initializeCache() {
    const startDateTime = new Date();
    const countries = await this.commonService.findAllCountries();
    await addToCache(
      this.cacheManager,
      CacheKey.COUNTRY,
      createCacheMap(countries, 'countryCode', 'countryName'),
    );

    const provinces = await this.commonService.findAllProvinces();
    await addToCache(
      this.cacheManager,
      CacheKey.PROVINCE,
      createCacheMap(provinces, 'provinceCode', 'provinceName'),
    );

    const permitTypes = await this.permitTypeService.findAllPermitTypes();
    await addToCache(
      this.cacheManager,
      CacheKey.PERMIT_TYPE,
      createCacheMap(permitTypes, 'permitTypeId', 'name'),
    );

    const powerUnitTypes = await this.powerUnitTypeService.findAll();
    await addToCache(
      this.cacheManager,
      CacheKey.POWER_UNIT_TYPE,
      createCacheMap(powerUnitTypes, 'typeCode', 'type'),
    );

    const trailerTypes = await this.trailerTypeService.findAll();
    await addToCache(
      this.cacheManager,
      CacheKey.TRAILER_TYPE,
      createCacheMap(trailerTypes, 'typeCode', 'type'),
    );

    const vehicleTypesMap = new Map<string, string>();
    vehicleTypesMap.set('powerUnit', 'Power Unit');
    vehicleTypesMap.set('trailer', 'Trailer');

    await addToCache(this.cacheManager, CacheKey.VEHICLE_TYPE, vehicleTypesMap);

    const paymentMethods =
      await this.paymentService.findAllPaymentMethodTypeEntities();
    await addToCache(
      this.cacheManager,
      CacheKey.PAYMENT_METHOD_TYPE,
      createCacheMap(paymentMethods, 'paymentMethodTypeCode', 'name'),
    );

    const paymentTypes =
      await this.paymentService.findAllPaymentCardTypeEntities();
    await addToCache(
      this.cacheManager,
      CacheKey.PAYMENT_CARD_TYPE,
      createCacheMap(paymentTypes, 'paymentCardTypeCode', 'name'),
    );

    const assetsPath =
      process.env.NODE_ENV === 'local'
        ? './src/modules/email/assets/'
        : './dist/modules/email/assets/';

    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_PROFILE_REGISTRATION,
      this.convertFiletoString(
        assetsPath + 'templates/profile-registration.email.hbs',
      ),
    );
    await addToCache(
      this.cacheManager,
      CacheKey.EMAIL_TEMPLATE_ISSUE_PERMIT,
      this.convertFiletoString(assetsPath + 'templates/issue-permit.email.hbs'),
    );

    const endDateTime = new Date();
    const processingTime = endDateTime.getTime() - startDateTime.getTime();
    console.log(
      `initializeCache() -> Start time: ${startDateTime.toISOString()},` +
        `End time: ${endDateTime.toISOString()},` +
        `Processing time: ${processingTime}ms`,
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
