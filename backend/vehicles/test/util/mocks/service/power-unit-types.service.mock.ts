/* eslint-disable @typescript-eslint/require-await */
import { UpdatePowerUnitTypeDto } from '../../../../src/modules/vehicles/power-unit-types/dto/request/update-power-unit-type.dto';
import { readPowerUnitTypeDtoMock } from '../data/power-unit-type.mock';

const TYPE_CODE = 'CONCRET';

export const powerUnitTypesServiceMock = {
  create: jest.fn().mockResolvedValue(readPowerUnitTypeDtoMock),
  findAll: jest.fn().mockResolvedValue([readPowerUnitTypeDtoMock]),
  findOne: jest.fn(async (typeCode: string) => {
    if (typeCode === readPowerUnitTypeDtoMock.typeCode) {
      return readPowerUnitTypeDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (
      typeCode: string,
      updatePowerUnitTypeDtoMock: UpdatePowerUnitTypeDto,
    ) => {
      if (typeCode === TYPE_CODE) {
        Object.assign(readPowerUnitTypeDtoMock, updatePowerUnitTypeDtoMock);
        return readPowerUnitTypeDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (typeCode: string) => {
    if (typeCode === TYPE_CODE) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
};
