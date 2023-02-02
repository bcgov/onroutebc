/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { PowerUnitsController } from './power-units.controller';
import { PowerUnitsService } from './power-units.service';
import { DataNotFoundException } from '../common/exception/data-not-found.exception';

const powerUnitId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const licensedGvw = 35600;
const steerAxleTireSize = 32;
const provinceId = 'CA-BC';
const powerUnitTypeCode = 'CONCRET';

const createPowerUnitDto: CreatePowerUnitDto = {
  provinceId: provinceId,
  powerUnitTypeCode: powerUnitTypeCode,
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  licensedGvw: licensedGvw,
  steerAxleTireSize: steerAxleTireSize,
};

const updatePowerUnitDto: UpdatePowerUnitDto = {
  ...createPowerUnitDto,
  unitNumber: 'KEN2',
};

const readPowerUnitDto: ReadPowerUnitDto = {
  powerUnitId: powerUnitId,
  createdDateTime: Date.now.toString(),
  ...createPowerUnitDto,
};

describe('PowerUnitsController', () => {
  let controller: PowerUnitsController;

  const mockPowerUnitsService = {
    create: jest.fn().mockResolvedValue(readPowerUnitDto),
    findAll: jest.fn().mockResolvedValue([readPowerUnitDto]),
    findOne: jest.fn(async (id: string) => {
      if (id === readPowerUnitDto.powerUnitId) {
        return readPowerUnitDto;
      } else {
        return null;
      }
    }),
    update: jest.fn(
      async (id: string, updatePowerUnitDto: UpdatePowerUnitDto) => {
        if (id === '1') {
          Object.assign(readPowerUnitDto, updatePowerUnitDto);
          return readPowerUnitDto;
        } else {
          return null;
        }
      },
    ),
    remove: jest.fn(async (id: string) => {
      if (id === '1') {
        return { affected: 1 };
      } else {
        return { affected: 0 };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitsController],
      providers: [
        { provide: PowerUnitsService, useValue: mockPowerUnitsService },
      ],
    }).compile();

    controller = module.get<PowerUnitsController>(PowerUnitsController);
  });

  it('Power unit Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Power unit controller create function.', () => {
    it('Create power unit.', async () => {
      const retPowerUnit = await controller.create(createPowerUnitDto);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe('1');
      expect(mockPowerUnitsService.create).toHaveBeenCalledWith(
        createPowerUnitDto,
      );
    });
  });

  describe('Power unit controller findAll function.', () => {
    it('Successfully return all the power units.', async () => {
      const retPowerUnits = await controller.findAll();
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits[0].powerUnitId).toBe('1');
      expect(retPowerUnits.length).toBe(1);
    });
  });

  describe('Power unit controller findOne function.', () => {
    it('Should return the power unit by Id.', async () => {
      const retPowerUnit = await controller.findOne('1');
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe('1');
      expect(mockPowerUnitsService.findOne).toHaveBeenCalledWith('1');
    });

    it('Should throw an DataNotFoundException if power unit is not found.', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller update function.', () => {
    it('Should update the power unit.', async () => {
      const retPowerUnit = await controller.update('1', updatePowerUnitDto);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe('1');
      expect(retPowerUnit.unitNumber).toEqual('KEN2');
      expect(mockPowerUnitsService.update).toHaveBeenCalledWith(
        '1',
        updatePowerUnitDto,
      );
    });

    it('Should thrown an exception if the power unit is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updatePowerUnitDto);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller remove function.', () => {
    it('Should delete the power unit', async () => {
      const deleteResult = await controller.remove('1');
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(mockPowerUnitsService.remove).toHaveBeenCalledWith('1');
    });

    it('Should thrown an exception if the given power unit is not found for deletion.', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
