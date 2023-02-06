import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PowerUnitType } from '../../../src/modules/vehicles/power-unit-types/entities/power-unit-type.entity';
import { PowerUnitTypesService } from '../../../src/modules/vehicles/power-unit-types/power-unit-types.service';
import { PowerUnitTypesProfile } from '../../../src/modules/vehicles/power-unit-types/profiles/power-unit-type.profile';
import {
  createPowerUnitTypeDtoMock,
  powerUnitTypeEntityMock,
  updatePowerUnitTypeDtoMock,
} from '../../util/mocks/data/power-unit-type.mock';

const TYPE_CODE = 'CONCRET';

describe('PowerUnitTypesService', () => {
  let service: PowerUnitTypesService;
  const repo = createMock<Repository<PowerUnitType>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PowerUnitTypesService,
        {
          provide: getRepositoryToken(PowerUnitType),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        PowerUnitTypesProfile,
      ],
    }).compile();

    service = module.get<PowerUnitTypesService>(PowerUnitTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Power unit type service create function', () => {
    it('should create a power unit type', async () => {
      repo.findOne.mockResolvedValue(powerUnitTypeEntityMock);
      const retPowerUnitType = await service.create(createPowerUnitTypeDtoMock);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Power unit service type findAll function', () => {
    it('should return all the power unit types', async () => {
      repo.find.mockResolvedValue([powerUnitTypeEntityMock]);
      const retPowerUnitTypes = await service.findAll();
      expect(typeof retPowerUnitTypes).toBe('object');
      expect(retPowerUnitTypes[0].typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Power unit type service findOne function', () => {
    it('should return the power unit type', async () => {
      repo.findOne.mockResolvedValue(powerUnitTypeEntityMock);
      const retPowerUnitType = await service.findOne(TYPE_CODE);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Power unit type service update function', () => {
    it('should update the power unit type', async () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitTypeEntityMock,
        description: 'updated',
      });
      const retPowerUnitType = await service.update(
        TYPE_CODE,
        updatePowerUnitTypeDtoMock,
      );
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(TYPE_CODE);
      expect(retPowerUnitType.description).toEqual('updated');
    });
  });

  describe('Power unit type service remove function', () => {
    it('should delete the power unit type', async () => {
      const deleteResult = await service.remove(TYPE_CODE);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
