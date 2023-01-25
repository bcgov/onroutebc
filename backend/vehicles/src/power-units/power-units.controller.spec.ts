/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { PowerUnitsController } from './power-units.controller';
import { PowerUnitsService } from './power-units.service';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';

describe('PowerUnitsController', () => {
  let controller: PowerUnitsController;

  const powerUnitDto = {
    unitNumber: 'KEN1',
    plate: 'AS 5895',
    provinceId: 'CA-BC',
    year: 2010,
    make: 'Kenworth',
    vin: '1ZVFT80N475211367',
    licensedGvw: 35600,
    powerUnitTypeCode: 'CONCRET',
    steerAxleTireSize: 32,
  };

  const createPowerUnitDto = new CreatePowerUnitDto(
    powerUnitDto.unitNumber,
    powerUnitDto.plate,
    powerUnitDto.provinceId,
    powerUnitDto.year,
    powerUnitDto.make,
    powerUnitDto.vin,
    powerUnitDto.powerUnitTypeCode,
    powerUnitDto.licensedGvw,
    powerUnitDto.steerAxleTireSize,
  );

  const readPowerUnitDto = new ReadPowerUnitDto(
    '1',
    powerUnitDto.unitNumber,
    powerUnitDto.plate,
    powerUnitDto.provinceId,
    powerUnitDto.year,
    powerUnitDto.make,
    powerUnitDto.vin,
    powerUnitDto.powerUnitTypeCode,
    powerUnitDto.licensedGvw,
    powerUnitDto.steerAxleTireSize,
    Date.now.toString(),
  );

  const updatePowerUnitDto = new UpdatePowerUnitDto(
    'KEN2',
    powerUnitDto.plate,
    powerUnitDto.provinceId,
    powerUnitDto.year,
    powerUnitDto.make,
    powerUnitDto.vin,
    powerUnitDto.powerUnitTypeCode,
    powerUnitDto.licensedGvw,
    powerUnitDto.steerAxleTireSize,
  );

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

  it('Power Unit Controller should be defined.', () => {
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
    it('Should update the Power Unit.', async () => {
      const retPowerUnit = await controller.update('1', updatePowerUnitDto);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe('1');
      expect(retPowerUnit.unitNumber).toEqual('KEN2');
      expect(mockPowerUnitsService.update).toHaveBeenCalledWith(
        '1',
        updatePowerUnitDto,
      );
    });

    it('Should thrown an exception if the Power Unit is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updatePowerUnitDto);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller remove function.', () => {
    it('Should delete the Power Unit', async () => {
      const deleteResult = await controller.remove('1');
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(mockPowerUnitsService.remove).toHaveBeenCalledWith('1');
    });

    it('Should thrown an exception if the given Power Unit is not found for deletion.', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
