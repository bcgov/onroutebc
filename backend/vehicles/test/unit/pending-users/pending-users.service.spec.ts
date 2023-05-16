import { createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { AutomapperModule, getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMapper } from '@automapper/core';
import { PendingUsersService } from '../../../src/modules/company-user-management/pending-users/pending-users.service';
import { Repository } from 'typeorm';
import { PendingUser } from '../../../src/modules/company-user-management/pending-users/entities/pending-user.entity';
import { PendingUsersProfile } from '../../../src/modules/company-user-management/pending-users/profiles/pending-user.profile';

// const COMPANY_ID_1 = 1;
// const USER_GUID = '06267945F2EB4E31B585932F78B76269';
// const COMPANY_GUID = '6F9619FF8B86D011B42D00C04FC964FF';

describe('PendingUsersService', () => {
  let service: PendingUsersService;
  const repo = createMock<Repository<PendingUser>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AutomapperModule],
      providers: [
        PendingUsersService,
        {
          provide: getRepositoryToken(PendingUser),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        PendingUsersProfile,
      ],
    }).compile();

    service = module.get<PendingUsersService>(PendingUsersService);
  });

  it('Pending User service should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('Company service create function', () => {
  //   it('should create a company and its admin user.', async () => {
  //     repo.findOne.mockResolvedValue(companyEntityMock);
  //     const retCompanyUser = await service.create(
  //       createCompanyDtoMock,
  //       Directory.BBCEID,
  //       currentUserMock,
  //     );
  //     expect(typeof retCompanyUser).toBe('object');
  //     expect(retCompanyUser.companyId).toBe(COMPANY_ID_1);
  //   });
  // });

  // describe('Company service update function', () => {
  //   it('should update the company', async () => {
  //     repo.findOne
  //       .mockResolvedValueOnce(companyEntityMock)
  //       .mockResolvedValueOnce({ ...companyEntityMock, phone: '8888888888' });
  //     repo.save.mockResolvedValue({
  //       ...companyEntityMock,
  //       phone: '8888888888',
  //     });

  //     const retCompany = await service.update(
  //       COMPANY_ID_1,
  //       { ...updateCompanyDtoMock, phone: '8888888888' },
  //       Directory.BBCEID,
  //     );

  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany.companyId).toBe(COMPANY_ID_1);
  //     expect(retCompany.phone).toEqual('8888888888');
  //   });
  // });

  // describe('Company service findOne function', () => {
  //   it('should return the Company', async () => {
  //     repo.findOne.mockResolvedValue(companyEntityMock);
  //     const retCompany = await service.findOne(COMPANY_ID_1);
  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany.companyId).toBe(COMPANY_ID_1);
  //   });
  // });

  // describe('Company service findCompanyMetadata function', () => {
  //   it('should return the Company Metadata', async () => {
  //     repo.findOne.mockResolvedValue(companyEntityMock);
  //     const retCompany = await service.findCompanyMetadata(COMPANY_ID_1);
  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany.companyId).toBe(COMPANY_ID_1);
  //   });
  // });

  // describe('Company service findOneByCompanyGuid function', () => {
  //   it('should return the Company details', async () => {
  //     repo.findOne.mockResolvedValue(companyEntityMock);
  //     const retCompany = await service.findOneByCompanyGuid(COMPANY_GUID);
  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany.companyId).toBe(COMPANY_ID_1);
  //   });
  // });

  // describe('Company service findCompanyMetadataByUserGuid function', () => {
  //   it('should return the Company Metadata List', async () => {
  //     const PARAMS = { userGUID: USER_GUID };
  //     const companyList: Company[] = [companyEntityMock];
  //     const FILTERED_LIST = companyList.filter(
  //       (r) => r.companyUsers[0].user.userGUID === PARAMS.userGUID,
  //     );

  //     jest
  //       .spyOn(repo, 'createQueryBuilder')
  //       .mockImplementation(() => createQueryBuilderMock(FILTERED_LIST));

  //     const retCompany = await service.findCompanyMetadataByUserGuid(USER_GUID);

  //     expect(typeof retCompany).toBe('object');
  //     expect(retCompany[0].companyId).toBe(COMPANY_ID_1);
  //   });
  // });
});
