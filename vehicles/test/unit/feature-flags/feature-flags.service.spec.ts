import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeatureFlag } from 'src/modules/feature-flags/entities/feature-flag.entity';
import { FeatureFlagsService } from 'src/modules/feature-flags/feature-flags.service';
import { dataSourceMockFactory } from 'test/util/mocks/factory/dataSource.factory.mock';
import { Repository, DataSource } from 'typeorm';

let repo: DeepMocked<Repository<FeatureFlag>>;
let cacheManager: DeepMocked<Cache>;

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    repo = createMock<Repository<FeatureFlag>>();
    cacheManager = createMock<Cache>();
    const dataSourceMock = dataSourceMockFactory() as DataSource;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagsService,
        {
          provide: getRepositoryToken(FeatureFlag),
          useValue: repo,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<FeatureFlagsService>(FeatureFlagsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('FeatureFlags service should be defined', () => {
    expect(service).toBeDefined();
  });
});
