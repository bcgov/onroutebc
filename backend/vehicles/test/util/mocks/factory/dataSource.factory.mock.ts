/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataSource } from 'typeorm';
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

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      rollbackTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      manager: {
        delete: jest.fn(),
        save: jest.fn(async (saveObject: object) => {
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
  }),
);

export const createQueryBuilderMock = (filteredList: object[]) => {
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
    getOne: jest.fn().mockImplementationOnce(() => {
      return filteredList[0];
    }),
    getMany: jest.fn().mockImplementationOnce(() => {
      return filteredList;
    }),
  };
};
