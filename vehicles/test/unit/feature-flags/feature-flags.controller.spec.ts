import { DeepMocked, createMock } from "@golevelup/ts-jest";
import { TestingModule, Test } from "@nestjs/testing";
import { GetCompanyQueryParamsDto } from "src/modules/company-user-management/company/dto/request/queryParam/getCompany.query-params.dto";
import { FeatureFlagsController } from "src/modules/feature-flags/feature-flags.controller";
import { FeatureFlagsService } from "src/modules/feature-flags/feature-flags.service";
import { paginationReadRedCompanyDtoMock } from "test/util/mocks/data/company.mock";
import { sysAdminStaffUserJWTMock } from "test/util/mocks/data/jwt.mock";

//const COMPANY_ID_99 = 99;
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

  /*
  describe('Company controller get function', () => {
    it('should return the company', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;

      companyService.findOne.mockResolvedValue(readRedCompanyDtoMock);
      const retCompany = await controller.get(
        request,
        constants.RED_COMPANY_ID,
      );
      expect(typeof retCompany).toBe('object');
      expect(retCompany).toEqual(readRedCompanyDtoMock);
    });

    it('should throw a DataNotFoundException if company is not found', async () => {
      const request = createMock<Request>();
      request.user = redCompanyAdminUserJWTMock;
      companyService.findOne.mockResolvedValue(undefined);
      await expect(async () => {
        await controller.get(request, COMPANY_ID_99);
      }).rejects.toThrow(DataNotFoundException);
    });
  });*/



  /*
  // Mock service call for getCompanyPaginated
  describe('Company controller getCompanyPaginated function', () => {
    it('should return the company data when company legal name or client number are provided', async () => {
      companyService.findCompanyPaginated.mockResolvedValue(
        paginationReadRedCompanyDtoMock,
      );
      const request = createMock<Request>();
      request.user = sysAdminStaffUserJWTMock;
      const getCompanyQueryParamsDto: GetCompanyQueryParamsDto = {
        page: 1,
        take: 10,
        orderBy: 'companyId:DESC',
        clientNumber: 'Red Truck Inc',
        legalName: 'B3-000005-722',
      };
      const retCompanyData = await controller.getCompanyPaginated(
        request,
        getCompanyQueryParamsDto,
      );
      expect(typeof retCompanyData).toBe('object');
      expect(retCompanyData).toEqual(paginationReadRedCompanyDtoMock);
      expect(retCompanyData.items.length).toBe(1);
    });
  });*/
});
