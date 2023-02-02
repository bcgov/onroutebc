import { createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { PowerUnitsProfile } from './profiles/power-unit.profile';
import { PowerUnitsService } from './power-units.service';
import { PowerUnit } from './entities/power-unit.entity';
import { Repository } from 'typeorm';
import { createMapper } from '@automapper/core';
import { Province } from 'src/common/entities/province.entity';
import { PowerUnitType } from 'src/power-unit-types/entities/power-unit-type.entity';

const powerUnitId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const licensedGvw = 35600;
const steerAxleTireSize = 32;

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: new Date(),
  updatedUser: 'user1',
  updatedDateTime: new Date(),
};

const province: Province = {
  provinceId: 'CA-BC',
  provinceCode: 'BC',
  provinceName: 'British Columbia',
  sortOrder: '1',
  country: null,
  powerUnits: null,
  trailers: null,
  ...base,
};

const powerUnitType: PowerUnitType = {
  typeCode: 'CONCRET',
  type: 'Concrete Pumper Trucks',
  description:
    'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
  sortOrder: '1',
  isActive: '1',
  powerUnits: null,
  ...base,
};

const createPowerUnitDto: CreatePowerUnitDto = {
  provinceId: province.provinceCode,
  powerUnitTypeCode: powerUnitType.typeCode,
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

const powerUnit: PowerUnit = {
  powerUnitId: powerUnitId,
  province: { ...province },
  powerUnitType: { ...powerUnitType },
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  licensedGvw: licensedGvw,
  steerAxleTireSize: steerAxleTireSize,
  ...base,
};

describe('PowerUnitsService', () => {
  let service: PowerUnitsService;
  const repo = createMock<Repository<PowerUnit>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PowerUnitsService,
        {
          provide: getRepositoryToken(PowerUnit),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        PowerUnitsProfile,
      ],
    }).compile();

    service = module.get<PowerUnitsService>(PowerUnitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Power unit service create function.', () => {
    it('Create power unit.', async () => {
      repo.save.mockResolvedValue(powerUnit);
      const retPowerUnits = await service.create(createPowerUnitDto);
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits.powerUnitId).toBe('1');
    });
  });

  describe('Power unit service findAll function.', () => {
    it('Successfully return all the power units.', async () => {
      repo.find.mockResolvedValue([powerUnit]);
      const retPowerUnits = await service.findAll();
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits[0].powerUnitId).toBe('1');
    });
  });

  describe('Power unit service findOne function.', () => {
    it('Should return the power unit by Id.', async () => {
      repo.findOne.mockResolvedValue(powerUnit);
      const retPowerUnits = await service.findOne('1');
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits.powerUnitId).toBe('1');
    });
  });

  describe('Power unit service update function.', () => {
    it('Should update the Power Unit.', async () => {
      repo.findOne.mockResolvedValue({ ...powerUnit, unitNumber: 'KEN2' });
      const retPowerUnits = await service.update('1', updatePowerUnitDto);
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits.powerUnitId).toBe('1');
      expect(retPowerUnits.unitNumber).toEqual('KEN2');
    });
  });

  describe('Power unit service remove function.', () => {
    it('Should delete the Power Unit', async () => {
      const deleteResult = await service.remove('1');
      expect(typeof deleteResult).toBe('object');
    });
  });
});
