import { createMock } from '@golevelup/ts-jest';
import { classes } from '@automapper/classes';
import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PowerUnitsProfile } from '../../../src/modules/vehicles/power-units/profiles/power-unit.profile';
import { PowerUnitsService } from '../../../src/modules/vehicles/power-units/power-units.service';
import { PowerUnit } from '../../../src/modules/vehicles/power-units/entities/power-unit.entity';
import { Repository } from 'typeorm';
import { createMapper } from '@automapper/core';
import {
  createPowerUnitDtoMock,
  powerUnitEntityMock,
  updatePowerUnitDtoMock,
} from '../../util/mocks/data/power-unit.mock';
import { redCompanyCvClientUserJWTMock } from 'test/util/mocks/data/jwt.mock';

const COMPANY_ID_1 = 1;
const POWER_UNIT_ID_1 = '1';
const POWER_UNIT_ID_2 = '2';
const POWER_UNIT_IDS = [POWER_UNIT_ID_1, POWER_UNIT_ID_2];

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

  it('Power unit service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe.skip('Power unit service create function', () => {
    it('should create a power unit.', async () => {
      repo.save.mockResolvedValue(powerUnitEntityMock);
      const retPowerUnit = await service.create(
        COMPANY_ID_1,
        createPowerUnitDtoMock,
        redCompanyCvClientUserJWTMock,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe(POWER_UNIT_ID_1);
    });
  });

  describe('Power unit service findAll function', () => {
    it('should return all the power units', async () => {
      repo.find.mockResolvedValue([powerUnitEntityMock]);
      const retPowerUnits = await service.findAll(COMPANY_ID_1);
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits[0].powerUnitId).toBe(POWER_UNIT_ID_1);
    });
  });

  describe('Power unit service findOne function', () => {
    it('should return the power unit', async () => {
      repo.findOne.mockResolvedValue(powerUnitEntityMock);
      const retPowerUnit = await service.findOne(COMPANY_ID_1, POWER_UNIT_ID_1);
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe(POWER_UNIT_ID_1);
    });
  });

  describe.skip('Power unit service update function', () => {
    it('should update the power unit', async () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitEntityMock,
        unitNumber: 'KEN2',
      });
      const retPowerUnit = await service.update(
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
        updatePowerUnitDtoMock,
        redCompanyCvClientUserJWTMock,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit.powerUnitId).toBe(POWER_UNIT_ID_1);
      expect(retPowerUnit.unitNumber).toEqual('KEN2');
    });
  });

  describe('Power unit service remove function.', () => {
    it('should delete the power Unit', async () => {
      repo.delete.mockResolvedValue({ raw: powerUnitEntityMock, affected: 1 });
      const deleteResult = await service.remove(COMPANY_ID_1, '1');
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.affected).toEqual(1);
    });
  });

  describe('Power unit service bulk delete function.', () => {
    it('should delete the power units with the ids provided in request if they belong to the given company', async () => {
      const deleteResult = await service.removeAll(
        POWER_UNIT_IDS,
        COMPANY_ID_1,
      );
      expect(typeof deleteResult).toBe('object');
    });
  });
});
