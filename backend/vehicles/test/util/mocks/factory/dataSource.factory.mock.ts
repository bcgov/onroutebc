/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataSource } from 'typeorm';
import { Company } from '../../../../src/modules/company-user-management/company/entities/company.entity';
import { companyEntityMock } from '../data/company.mock';
import { User } from '../../../../src/modules/company-user-management/users/entities/user.entity';
import { userEntityMock } from '../data/user.mock';

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
        save: jest.fn(async (saveObject: object) => {
          if (saveObject instanceof Company) {
            return companyEntityMock;
          } else if (saveObject instanceof User) {
            return userEntityMock;
          }
        }),
      },
    })),
  }),
);
