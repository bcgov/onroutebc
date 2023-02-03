/* eslint-disable @typescript-eslint/require-await */
import { UpdatePowerUnitDto } from '../../../../src/modules/power-units/dto/request/update-power-unit.dto';
import { readPowerUnitDtoMock } from '../data/power-unit.mock';

const POWER_UNIT_ID_1 = '1';

export const powerUnitsServiceMock = {
  create: jest.fn().mockResolvedValue(readPowerUnitDtoMock),
  findAll: jest.fn().mockResolvedValue([readPowerUnitDtoMock]),
  findOne: jest.fn(async (id: string) => {
    if (id === POWER_UNIT_ID_1) {
      return readPowerUnitDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (id: string, updatePowerUnitDtoMock: UpdatePowerUnitDto) => {
      if (id === POWER_UNIT_ID_1) {
        Object.assign(readPowerUnitDtoMock, updatePowerUnitDtoMock);
        return readPowerUnitDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (id: string) => {
    if (id === POWER_UNIT_ID_1) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
};
