import { TestingModule, Test } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { CompanyController } from '../../../src/modules/company-user-management/company/company.controller';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { companyServiceMock } from '../../util/mocks/service/company.service.mock';
import {
  createCompanyDtoMock,
  readCompanyDtoMock,
  readCompanyMetadataDtoMock,
  updateCompanyDtoMock,
} from '../../util/mocks/data/company.mock';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { currentUserMock } from '../../util/mocks/data/user.mock';
import { getDirectory } from '../../../src/common/helper/auth.helper';
import { IUserJWT } from '../../../src/common/interface/user-jwt.interface';

const COMPANY_ID_1 = 1;
const COMPANY_ID_2 = 2;
const USER_GUID_1 = '06267945F2EB4E31B585932F78B76269';
const USER_GUID_2 = '081BA455A00D4374B0CC13092117A706';

describe('CompanyController', () => {
  let controller: CompanyController;
  const request = createMock<Request>();
  request.user = currentUserMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: companyServiceMock }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('Company Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Company controller create function', () => {
    it('should create a company', async () => {
      const currentUser = request.user as IUserJWT;
      const retCompany = await controller.create(request, createCompanyDtoMock);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toEqual(readCompanyDtoMock.companyId);
      expect(retCompany.mailingAddress).toEqual(
        readCompanyDtoMock.mailingAddress,
      );
      expect(companyServiceMock.create).toHaveBeenCalledWith(
        createCompanyDtoMock,
        getDirectory(currentUser),
        currentUser,
      );
    });
  });

  describe('Company controller get function', () => {
    it('should return the company', async () => {
      const retCompany = await controller.get(request, COMPANY_ID_1);
      expect(typeof retCompany).toBe('object');
      expect(retCompany).toEqual(readCompanyDtoMock);
    });

    it('should throw a DataNotFoundException if company is not found', async () => {
      await expect(async () => {
        await controller.get(request, COMPANY_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Company controller getCompanyMetadata function', () => {
    it('should return the company metadata when userGUID is provided', async () => {
      const retCompanyMetadata = await controller.getCompanyMetadata(
        request,
        USER_GUID_1,
      );
      expect(typeof retCompanyMetadata).toBe('object');
      expect(retCompanyMetadata).toContainEqual(readCompanyMetadataDtoMock);
      expect(retCompanyMetadata.length).toBe(1);
    });

    // it('should throw a DataNotFoundException if company is not found', async () => {
    //   await expect(async () => {
    //      await controller.getCompanyMetadata(request, USER_GUID_1);
    //   }).rejects.toThrow(DataNotFoundException);
    // });
  });

  // describe('Company controller findAll function', () => {
  //   it('should return all the power units', async () => {
  //     const retCompanys = await controller.findAll(COMPANY_ID_1);
  //     expect(typeof retCompanys).toBe('object');
  //     expect(retCompanys).toContainEqual(readCompanyDtoMock);
  //     expect(retCompanys.length).toBe(1);
  //   });
  // });

  // describe('Company controller update function', () => {
  //   it('should update the power unit', async () => {
  //     const retCompany = await controller.update(
  //       null,
  //       COMPANY_ID_1,
  //       POWER_UNIT_ID_1,
  //       updateCompanyDtoMock,
  //     );
  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany).toEqual({
  //       ...readCompanyDtoMock,
  //       unitNumber: 'KEN2',
  //     });
  //     expect(companyServiceMock.update).toHaveBeenCalledWith(
  //       COMPANY_ID_1,
  //       POWER_UNIT_ID_1,
  //       updateCompanyDtoMock,
  //     );
  //   });

  //   it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
  //     await expect(async () => {
  //       await controller.update(
  //         null,
  //         COMPANY_ID_1,
  //         POWER_UNIT_ID_2,
  //         updateCompanyDtoMock,
  //       );
  //     }).rejects.toThrow(DataNotFoundException);
  //   });
  // });

  // describe('Company controller remove function.', () => {
  //   it('should delete the power unit', async () => {
  //     const deleteResult = await controller.remove(
  //       null,
  //       COMPANY_ID_1,
  //       POWER_UNIT_ID_1,
  //     );
  //     expect(typeof deleteResult).toBe('object');
  //     expect(deleteResult.deleted).toBeTruthy();
  //     expect(companyServiceMock.remove).toHaveBeenCalledWith(
  //       COMPANY_ID_1,
  //       POWER_UNIT_ID_1,
  //     );
  //   });

  //   it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
  //     await expect(async () => {
  //       await controller.remove(null, COMPANY_ID_1, POWER_UNIT_ID_2);
  //     }).rejects.toThrow(DataNotFoundException);
  //   });
  // });

  // describe('Company controller bulk delete function.', () => {
  //   it('should delete the power unit', async () => {
  //     const deleteResult = await controller.deleteCompanys(
  //       deleteCompanyMock,
  //       COMPANY_ID_1,
  //     );
  //     expect(typeof deleteResult).toBe('object');
  //     expect(deleteResult.success).toBeTruthy();
  //     expect(deleteResult.failure).toBeTruthy();
  //     expect(deleteResult).toEqual(deleteDtoMock);
  //     expect(companyServiceMock.removeAll).toHaveBeenCalledWith(
  //       deleteCompanyMock.powerUnits,
  //       COMPANY_ID_1,
  //     );
  //   });

  //   it('should thrown a DataNotFoundException if the power unit does not exist or cannot be deleted', async () => {
  //     await expect(async () => {
  //       deleteCompanyMock.powerUnits = [POWER_UNIT_ID_2];
  //       await controller.deleteCompanys(deleteCompanyMock, COMPANY_ID_1);
  //     }).rejects.toThrow(DataNotFoundException);
  //   });
  // });
});
