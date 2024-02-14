import { classes } from "@automapper/classes";
import { createMapper } from "@automapper/core";
import { AutomapperModule, getMapperToken } from "@automapper/nestjs";
import { DeepMocked, createMock } from "@golevelup/ts-jest";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FeatureFlag } from "src/modules/feature-flags/entities/feature-flag.entity";
import { FeatureFlagsService } from "src/modules/feature-flags/feature-flags.service";
import { FeatureFlagsProfile } from "src/modules/feature-flags/profiles/feature-flags.profile";
import { dataSourceMockFactory } from "test/util/mocks/factory/dataSource.factory.mock";
import { Repository, DataSource } from "typeorm";

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
      imports: [AutomapperModule],
      providers: [
        FeatureFlagsService,
        {
          provide: getRepositoryToken(FeatureFlag),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
        FeatureFlagsProfile,
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

  /*
  describe('FeatureFlags service findAll function', () => {
    it('should return the FeatureFlags', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retFeatureFlag = await service.findAll();
      expect(typeof retFeatureFlag).toBe('object');
      expect(retFeatureFlag.featureId).toBe(constants.RED_COMPANY_ID);
    });
  });*/

  /*
  describe('Company service findOne function', () => {
    it('should return the Company', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findOne(constants.RED_COMPANY_ID);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });*/

  /*
  describe('Company service findCompanyMetadata function', () => {
    it('should return the Company Metadata', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findCompanyMetadata(
        constants.RED_COMPANY_ID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });*/

/*
  describe('Company service findOneByCompanyGuid function', () => {
    it('should return the Company details', async () => {
      repo.findOne.mockResolvedValue(redCompanyEntityMock);
      const retCompany = await service.findOneByCompanyGuid(
        constants.RED_COMPANY_GUID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(constants.RED_COMPANY_ID);
    });
  });*/

  /*
  describe('Company service findCompanyMetadataByUserGuid function', () => {
    it('should return the Company Metadata List', async () => {
      const PARAMS = { userGUID: constants.RED_COMPANY_ADMIN_USER_GUID };
      const FILTERED_LIST = COMPANY_LIST.filter(
        (r) => r.companyUsers[0].user.userGUID === PARAMS.userGUID,
      );

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

      const retCompany = await service.findCompanyMetadataByUserGuid(
        constants.RED_COMPANY_ADMIN_USER_GUID,
      );

      expect(typeof retCompany).toBe('object');
      expect(retCompany[0].companyId).toBe(constants.RED_COMPANY_ID);
    });
  });*/

  /*
  describe('Company service findCompanyPaginated function', () => {
    it('should return the Paginated Company List', async () => {
      const PARAMS = {
        pageOptionsDto: { page: 1, take: 10 },
        legalName: constants.RED_COMPANY_LEGAL_NAME,
        clientNumber: constants.RED_COMPANY_CLIENT_NUMBER,
      };
      const FILTERED_LIST = COMPANY_LIST.filter(
        (r) => r.legalName === PARAMS.legalName,
      ).filter((r) => r.clientNumber === PARAMS.clientNumber);

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

      const getCompanyQueryParamsDto: GetCompanyQueryParamsDto = {
        page: 1,
        take: 10,
        orderBy: 'companyId:DESC',
        clientNumber: 'Red Truck Inc',
        legalName: 'B3-000005-722',
      };

      const retCompanies = await service.findCompanyPaginated({
        page: getCompanyQueryParamsDto.page,
        take: getCompanyQueryParamsDto.take,
        orderBy: getCompanyQueryParamsDto.orderBy,
        legalName: getCompanyQueryParamsDto.legalName,
        clientNumber: getCompanyQueryParamsDto.clientNumber,
      });

      expect(typeof retCompanies).toBe('object');
      expect(retCompanies.items.length).toBeGreaterThan(0);
    });
  });*/
});
