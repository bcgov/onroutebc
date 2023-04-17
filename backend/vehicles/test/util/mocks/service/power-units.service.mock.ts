/* eslint-disable @typescript-eslint/require-await */
import { UpdatePowerUnitDto } from '../../../../src/modules/vehicles/power-units/dto/request/update-power-unit.dto';
import { deleteDtoMock } from '../data/delete-dto.mock';
import { readPowerUnitDtoMock } from '../data/power-unit.mock';

const POWER_UNIT_ID_1 = '1';
const COMPANY_ID_1 = 1;

export const powerUnitsServiceMock = {
  create: jest.fn().mockResolvedValue(readPowerUnitDtoMock),
  findAll: jest.fn().mockResolvedValue([readPowerUnitDtoMock]),
  findOne: jest.fn(async (companyId: number, id: string) => {
    if (companyId === COMPANY_ID_1 && id === POWER_UNIT_ID_1) {
      return readPowerUnitDtoMock;
    } else {
      return null;
    }
  }),
  update: jest.fn(
    async (
      companyId: number,
      id: string,
      updatePowerUnitDtoMock: UpdatePowerUnitDto,
    ) => {
      if (companyId === COMPANY_ID_1 && id === POWER_UNIT_ID_1) {
        Object.assign(readPowerUnitDtoMock, updatePowerUnitDtoMock);
        return readPowerUnitDtoMock;
      } else {
        return null;
      }
    },
  ),
  remove: jest.fn(async (companyId: number, id: string) => {
    if (companyId === COMPANY_ID_1 && id === POWER_UNIT_ID_1) {
      return { affected: 1 };
    } else {
      return { affected: 0 };
    }
  }),
  removeAll: jest.fn(async (powerUnitIds: string[], companyId: number) => {
    if (
      powerUnitIds.length == 1 &&
      powerUnitIds[0] === POWER_UNIT_ID_1 &&
      companyId === COMPANY_ID_1
    ) {
      return deleteDtoMock;
    } else {
      return null;
    }
  }),
};
