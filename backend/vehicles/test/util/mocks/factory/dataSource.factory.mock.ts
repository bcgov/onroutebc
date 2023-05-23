/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Company } from '../../../../src/modules/company-user-management/company/entities/company.entity';
import { User } from '../../../../src/modules/company-user-management/users/entities/user.entity';
import * as constants from '../data/test-data.constants';
import {
  blueCompanyEntityMock,
  redCompanyEntityMock,
} from '../data/company.mock';
import {
  blueCompanyAdminUserEntityMock,
  blueCompanyCvClientUserEntityMock,
  redCompanyAdminUserEntityMock,
  redCompanyCvClientUserEntityMock,
} from '../data/user.mock';
import { DataSource } from 'typeorm';


export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

export const dataSourceMockFactory = () => {
  return {
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      rollbackTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      manager: {
        delete: jest.fn(),
        save: jest.fn((saveObject: object) => {
          if (saveObject instanceof Company) {
            if (saveObject.legalName === constants.RED_COMPANY_LEGAL_NAME) {
              return redCompanyEntityMock;
            } else if (
              saveObject.legalName === constants.BLUE_COMPANY_LEGAL_NAME
            ) {
              return blueCompanyEntityMock;
            }
          } else if (saveObject instanceof User) {
            if (saveObject.userGUID === constants.RED_COMPANY_ADMIN_USER_GUID) {
              return redCompanyAdminUserEntityMock;
            } else if (
              saveObject.userGUID === constants.RED_COMPANY_CVCLIENT_USER_GUID
            ) {
              return redCompanyCvClientUserEntityMock;
            } else if (
              saveObject.userGUID === constants.BLUE_COMPANY_ADMIN_USER_GUID
            ) {
              return blueCompanyAdminUserEntityMock;
            } else if (
              saveObject.userGUID === constants.BLUE_COMPANY_CVCLIENT_USER_GUID
            ) {
              return blueCompanyCvClientUserEntityMock;
            }
          }
        }),
      },
    })),
  };
};

export const createQueryBuilderMock = (
  filteredList: object[],
  customGetOne?: jest.Mock,
  customGetMany?: jest.Mock,
) => {
  return {
    ...jest.requireActual('typeorm/query-builder/SelectQueryBuilder'),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    getOne: customGetOne
      ? customGetOne
      : jest.fn().mockImplementation(() => {
          return filteredList[0];
        }),
    getMany: customGetMany
      ? customGetMany
      : jest.fn().mockImplementation(() => {
          return filteredList;
        }),
  };
};
// export const dataSourceMockFactory1 = (): DataSource => ({
//   // Add methods and properties from your DataSource class that you need to mock.
//   // For example, if you are using a `save` method, add it here:
//   save: jest.fn(/* your implementation */),
//   // Add other methods as needed
// });