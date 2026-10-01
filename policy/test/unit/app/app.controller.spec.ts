import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FeatureFlagsService } from '@modules/feature-flags/feature-flags.service';

describe('AppController', () => {
  let appController: AppController;

  let featureFlagsService: DeepMocked<FeatureFlagsService>;

  beforeEach(async () => {
    featureFlagsService = createMock<FeatureFlagsService>();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
        {
          provide: FeatureFlagsService,
          useValue: featureFlagsService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Policy Healthcheck!"', () => {
      expect(appController.getHello()).toBe('Policy Healthcheck!');
    });
  });
});
