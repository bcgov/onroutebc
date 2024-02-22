import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { FeatureFlagsService } from '../../src/modules/feature-flags/feature-flags.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';

describe('AppController', () => {
  let appController: AppController;
  let featureFlagsService: DeepMocked<FeatureFlagsService>;

  beforeEach(async () => {
    featureFlagsService = createMock<FeatureFlagsService>();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: FeatureFlagsService,
          useValue: featureFlagsService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "TPS Migration Healthcheck!"', () => {
      expect(appController.getHealthCheck()).toBe('TPS Migration Healthcheck!');
    });
  });
});
