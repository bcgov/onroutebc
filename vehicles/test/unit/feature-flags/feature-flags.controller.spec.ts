import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TestingModule, Test } from '@nestjs/testing';
import { FeatureFlagsController } from 'src/modules/feature-flags/feature-flags.controller';
import { FeatureFlagsService } from 'src/modules/feature-flags/feature-flags.service';

let service: DeepMocked<FeatureFlagsService>;

describe('FeatureFlagsController', () => {
  let controller: FeatureFlagsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    service = createMock<FeatureFlagsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureFlagsController],
      providers: [{ provide: FeatureFlagsService, useValue: service }],
    }).compile();

    controller = module.get<FeatureFlagsController>(FeatureFlagsController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('FeatureFlags Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });
});
