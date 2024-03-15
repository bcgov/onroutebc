import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { PowerUnitTypesService } from 'src/modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from 'src/modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from 'src/modules/common/common.service';
import { FeatureFlagsService } from 'src/modules/feature-flags/feature-flags.service';
import { PermitService } from '../../../src/modules/permit-application-payment/permit/permit.service';
import { PaymentService } from '../../../src/modules/permit-application-payment/payment/payment.service';
import { ApplicationService } from '../../../src/modules/permit-application-payment/application/application.service';

let permitServiceMock: DeepMocked<PermitService>;
let applicationServiceMock: DeepMocked<ApplicationService>;
let powerUnitTypeServiceMock: DeepMocked<PowerUnitTypesService>;
let trailerTypeServiceMock: DeepMocked<TrailerTypesService>;
let commonServiceMock: DeepMocked<CommonService>;
let paymentServiceMock: DeepMocked<PaymentService>;
let featureFlagsServiceMock: DeepMocked<FeatureFlagsService>;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    permitServiceMock = createMock<PermitService>();
    applicationServiceMock = createMock<ApplicationService>();
    powerUnitTypeServiceMock = createMock<PowerUnitTypesService>();
    trailerTypeServiceMock = createMock<TrailerTypesService>();
    commonServiceMock = createMock<CommonService>();
    paymentServiceMock = createMock<PaymentService>();
    featureFlagsServiceMock = createMock<FeatureFlagsService>();

    const app: TestingModule = await Test.createTestingModule({
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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Vehicles Healthcheck!"', () => {
      expect(appController.getHello()).toBe('Vehicles Healthcheck!');
    });
  });
});
