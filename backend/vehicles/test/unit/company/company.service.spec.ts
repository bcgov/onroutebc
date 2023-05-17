/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { CompanyService } from '../../../src/modules/company-user-management/company/company.service';
import { CompanyProfile } from '../../../src/modules/company-user-management/company/profiles/company.profile';
import { Company } from '../../../src/modules/company-user-management/company/entities/company.entity';
import { DataSource, Repository } from 'typeorm';
import {
  MockType,
  createQueryBuilderMock,
  dataSourceMockFactory,
} from '../../util/mocks/factory/dataSource.factory.mock';
import { UsersProfile } from '../../../src/modules/company-user-management/users/profiles/user.profile';
import { Directory } from '../../../src/common/enum/directory.enum';
import { AddressProfile } from '../../../src/modules/common/profiles/address.profile';
import { ContactProfile } from '../../../src/modules/common/profiles/contact.profile';
import {
  companyEntityMock,
  createCompanyDtoMock,
  updateCompanyDtoMock,
} from '../../util/mocks/data/company.mock';
import { currentUserMock } from '../../util/mocks/data/user.mock';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { InternalServerErrorException } from '@nestjs/common';

const COMPANY_ID_1 = 1;
const COMPANY_ID_2 = 2;
const USER_GUID = '06267945F2EB4E31B585932F78B76269';
const COMPANY_GUID = '6F9619FF8B86D011B42D00C04FC964FF';

describe('CompanyService', () => {
  let service: CompanyService;
  const repo = createMock<Repository<Company>>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSourceMock: MockType<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
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
          useFactory: dataSourceMockFactory,
        },
        CompanyProfile,
        ContactProfile,
        AddressProfile,
        UsersProfile,
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);    
  });

  it('Company service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Company service create function', () => {
    it('should create a company and its admin user.', async () => {
      repo.findOne.mockResolvedValue(companyEntityMock);
      const retCompanyUser = await service.create(
        createCompanyDtoMock,
        Directory.BBCEID,
        currentUserMock,
      );
      expect(typeof retCompanyUser).toBe('object');
      expect(retCompanyUser.companyId).toBe(COMPANY_ID_1);
    });

    it('should catch and throw and Internal Error Exceptions user.', async () => {
      await expect(async () => {
        await service.create(null, Directory.BBCEID, currentUserMock);
      }).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('Company service update function', () => {
    it('should update the company', async () => {
      repo.findOne
        .mockResolvedValueOnce(companyEntityMock)
        .mockResolvedValueOnce({ ...companyEntityMock, phone: '8888888888' });
      repo.save.mockResolvedValue({
        ...companyEntityMock,
        phone: '8888888888',
      });

      const retCompany = await service.update(
        COMPANY_ID_1,
        { ...updateCompanyDtoMock, phone: '8888888888' },
        Directory.BBCEID,
      );

      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(COMPANY_ID_1);
      expect(retCompany.phone).toEqual('8888888888');
    });

    it('should throw DataNotFound Exception', async () => {
      repo.findOne.mockResolvedValueOnce(null);

      await expect(async () => {
        await service.update(
          COMPANY_ID_2,
          { ...updateCompanyDtoMock, phone: '8888888888' },
          Directory.BBCEID,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Company service findOne function', () => {
    it('should return the Company', async () => {
      repo.findOne.mockResolvedValue(companyEntityMock);
      const retCompany = await service.findOne(COMPANY_ID_1);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Company service findCompanyMetadata function', () => {
    it('should return the Company Metadata', async () => {
      repo.findOne.mockResolvedValue(companyEntityMock);
      const retCompany = await service.findCompanyMetadata(COMPANY_ID_1);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Company service findOneByCompanyGuid function', () => {
    it('should return the Company details', async () => {
      repo.findOne.mockResolvedValue(companyEntityMock);
      const retCompany = await service.findOneByCompanyGuid(COMPANY_GUID);
      expect(typeof retCompany).toBe('object');
      expect(retCompany.companyId).toBe(COMPANY_ID_1);
    });
  });

  describe('Company service findCompanyMetadataByUserGuid function', () => {
    it('should return the Company Metadata List', async () => {
      const PARAMS = { userGUID: USER_GUID };
      const companyList: Company[] = [companyEntityMock];
      const FILTERED_LIST = companyList.filter(
        (r) => r.companyUsers[0].user.userGUID === PARAMS.userGUID,
      );

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

      const retCompany = await service.findCompanyMetadataByUserGuid(USER_GUID);

      expect(typeof retCompany).toBe('object');
      expect(retCompany[0].companyId).toBe(COMPANY_ID_1);
    });
  });
});
