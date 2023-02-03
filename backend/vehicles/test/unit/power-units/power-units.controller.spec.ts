import { Test, TestingModule } from '@nestjs/testing';
import { PowerUnitsController } from '../../../src/modules/power-units/power-units.controller';
import { PowerUnitsService } from '../../../src/modules/power-units/power-units.service';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import {
  createPowerUnitDtoMock,
  readPowerUnitDtoMock,
  updatePowerUnitDtoMock,
} from '../../util/mocks/data/power-unit.mock';
import { powerUnitsServiceMock } from '../../util/mocks/service/power-units.service.mock';

const POWER_UNIT_ID_1 = '1';
const POWER_UNIT_ID_2 = '2';

describe('PowerUnitsController', () => {
  let controller: PowerUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitsController],
      providers: [
        { provide: PowerUnitsService, useValue: powerUnitsServiceMock },
      ],
    }).compile();

    controller = module.get<PowerUnitsController>(PowerUnitsController);
  });

  it('Power unit Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Power unit controller create function', () => {
    it('should create a power unit', async () => {
      const retPowerUnit = await controller.create(createPowerUnitDtoMock);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual(readPowerUnitDtoMock);
      expect(powerUnitsServiceMock.create).toHaveBeenCalledWith(
        createPowerUnitDtoMock,
      );
    });
  });

  describe('Power unit controller findAll function', () => {
    it('should return all the power units', async () => {
      const retPowerUnits = await controller.findAll();
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits).toContainEqual(readPowerUnitDtoMock);
      expect(retPowerUnits.length).toBe(1);
    });
  });

  describe('Power unit controller findOne function', () => {
    it('should return the power unit', async () => {
      const retPowerUnit = await controller.findOne(POWER_UNIT_ID_1);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual(readPowerUnitDtoMock);
      expect(powerUnitsServiceMock.findOne).toHaveBeenCalledWith(
        POWER_UNIT_ID_1,
      );
    });

    it('should throw a DataNotFoundException if power unit is not found', async () => {
      await expect(async () => {
        await controller.findOne(POWER_UNIT_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller update function', () => {
    it('should update the power unit', async () => {
      const retPowerUnit = await controller.update(
        POWER_UNIT_ID_1,
        updatePowerUnitDtoMock,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual({
        ...readPowerUnitDtoMock,
        unitNumber: 'KEN2',
      });
      expect(powerUnitsServiceMock.update).toHaveBeenCalledWith(
        POWER_UNIT_ID_1,
        updatePowerUnitDtoMock,
      );
    });

    it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
      await expect(async () => {
        await controller.update(POWER_UNIT_ID_2, updatePowerUnitDtoMock);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller remove function.', () => {
    it('should delete the power unit', async () => {
      const deleteResult = await controller.remove(POWER_UNIT_ID_1);
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(powerUnitsServiceMock.remove).toHaveBeenCalledWith(
        POWER_UNIT_ID_1,
      );
    });

    it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
      await expect(async () => {
        await controller.remove(POWER_UNIT_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
