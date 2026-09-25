import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { PowerUnitTypesService } from '@modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from '@modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from '@modules/common/common.service';
import { App } from 'supertest/types';
import { FeatureFlagsService } from '@modules/feature-flags/feature-flags.service';
import { PermitService } from '@modules/permit-application-payment/permit/permit.service';
import { PaymentService } from '@modules/permit-application-payment/payment/payment.service';
import { ApplicationService } from '@modules/permit-application-payment/application/application.service';

let permitServiceMock: DeepMocked<PermitService>;
let applicationServiceMock: DeepMocked<ApplicationService>;
let powerUnitTypeServiceMock: DeepMocked<PowerUnitTypesService>;
let trailerTypeServiceMock: DeepMocked<TrailerTypesService>;
let commonServiceMock: DeepMocked<CommonService>;
let paymentServiceMock: DeepMocked<PaymentService>;
let featureFlagsServiceMock: DeepMocked<FeatureFlagsService>;

describe('AppController (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    permitServiceMock = createMock<PermitService>();
    applicationServiceMock = createMock<ApplicationService>();
    powerUnitTypeServiceMock = createMock<PowerUnitTypesService>();
    trailerTypeServiceMock = createMock<TrailerTypesService>();
    commonServiceMock = createMock<CommonService>();
    paymentServiceMock = createMock<PaymentService>();
    featureFlagsServiceMock = createMock<FeatureFlagsService>();

    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
        {
          provide: PermitService,
          useValue: permitServiceMock,
        },
        {
          provide: ApplicationService,
          useValue: applicationServiceMock,
        },
        {
          provide: PowerUnitTypesService,
          useValue: powerUnitTypeServiceMock,
        },
        {
          provide: TrailerTypesService,
          useValue: trailerTypeServiceMock,
        },
        {
          provide: CommonService,
          useValue: commonServiceMock,
        },
        {
          provide: PaymentService,
          useValue: paymentServiceMock,
        },
        {
          provide: FeatureFlagsService,
          useValue: featureFlagsServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () =>
    request(app.getHttpServer() as unknown as App)
      .get('/')
      .expect(200)
      .expect('Vehicles Healthcheck!'));
});
