import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { PowerUnitTypesController } from '../../../src/modules/power-unit-types/power-unit-types.controller';
import { PowerUnitTypesService } from '../../../src/modules/power-unit-types/power-unit-types.service';
import {
  createPowerUnitTypeDtoMock,
  readPowerUnitTypeDtoMock,
  updatePowerUnitTypeDtoMock,
} from '../../util/mocks/data/power-unit-type.mock';
import { powerUnitTypesServiceMock } from '../../util/mocks/service/power-unit-types.service.mock';

const TYPE_CODE = 'CONCRET';

describe('PowerUnitTypesController', () => {
  let controller: PowerUnitTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitTypesController],
      providers: [
        { provide: PowerUnitTypesService, useValue: powerUnitTypesServiceMock },
      ],
    }).compile();

    controller = module.get<PowerUnitTypesController>(PowerUnitTypesController);
  });

  it('Power Unit Types Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Power unit types controller create function', () => {
    it('should create power unit type', async () => {
      const retPowerUnitType = await controller.create(
        createPowerUnitTypeDtoMock,
      );
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType).toEqual(readPowerUnitTypeDtoMock);
      expect(powerUnitTypesServiceMock.create).toHaveBeenCalledWith(
        createPowerUnitTypeDtoMock,
      );
    });
  });

  describe('Power unit types controller findAll function', () => {
    it('should return all the power unit types', async () => {
      const retPowerUnitTypes = await controller.findAll();
      expect(typeof retPowerUnitTypes).toBe('object');
      expect(retPowerUnitTypes).toContainEqual(readPowerUnitTypeDtoMock);
      expect(retPowerUnitTypes.length).toBe(1);
    });
  });

  describe('Power unit types controller findOne function', () => {
    it('should return the power unit type', async () => {
      const retPowerUnitType = await controller.findOne(TYPE_CODE);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType).toEqual(readPowerUnitTypeDtoMock);
      expect(powerUnitTypesServiceMock.findOne).toHaveBeenCalledWith(TYPE_CODE);
    });

    it('should throw a DataNotFoundException if power unit type is not found', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit types controller update function', () => {
    it('should update the power unit type', async () => {
      const retPowerUnitType = await controller.update(
        TYPE_CODE,
        updatePowerUnitTypeDtoMock,
      );
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType).toEqual({
        ...readPowerUnitTypeDtoMock,
        description: 'updated',
      });
      expect(powerUnitTypesServiceMock.update).toHaveBeenCalledWith(
        TYPE_CODE,
        updatePowerUnitTypeDtoMock,
      );
    });

    it('should thrown a DataNotFoundException if the power unit type is not found for update', async () => {
      await expect(async () => {
        await controller.update('2', updatePowerUnitTypeDtoMock);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit types controller remove function', () => {
    it('should delete the Power Unit type', async () => {
      const deleteResult = await controller.remove(TYPE_CODE);
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(powerUnitTypesServiceMock.remove).toHaveBeenCalledWith(TYPE_CODE);
    });

    it('should thrown a DataNotFoundException if the given power unit type is not found for deletion', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
