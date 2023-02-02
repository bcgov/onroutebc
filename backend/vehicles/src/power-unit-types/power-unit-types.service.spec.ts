import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePowerUnitTypeDto } from './dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/request/update-power-unit-type.dto';
import { PowerUnitType } from './entities/power-unit-type.entity';
import { PowerUnitTypesService } from './power-unit-types.service';
import { PowerUnitTypesProfile } from './profiles/power-unit-type.profile';

const typeCode = 'CONCRET';
const type = 'Concrete Pumper Trucks';
const description =
  'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.';
const sortOrder = '1';
const isActive = '1';

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: new Date(),
  updatedUser: 'user1',
  updatedDateTime: new Date(),
};

const powerUnitType: PowerUnitType = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
  isActive: isActive,
  powerUnits: null,
  ...base,
};

const createPowerUnitTypeDto: CreatePowerUnitTypeDto = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
};

const updatePowerUnitTypeDto: UpdatePowerUnitTypeDto = {
  ...createPowerUnitTypeDto,
  description: 'updated',
};

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

  describe('Power unit type service create function.', () => {
    it('Create power unit type.', async () => {
      repo.findOne.mockResolvedValue(powerUnitType);
      const retPowerUnitType = await service.create(createPowerUnitTypeDto);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
    });
  });

  describe('Power unit service type findAll function.', () => {
    it('Successfully return all the power unit types.', async () => {
      repo.find.mockResolvedValue([powerUnitType]);
      const retPowerUnitTypes = await service.findAll();
      expect(typeof retPowerUnitTypes).toBe('object');
      expect(retPowerUnitTypes[0].typeCode).toBe(typeCode);
    });
  });

  describe('Power unit type service findOne function.', () => {
    it('Should return the power unit type by typeCode.', async () => {
      repo.findOne.mockResolvedValue(powerUnitType);
      const retPowerUnitType = await service.findOne(typeCode);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
    });
  });

  describe('Power unit type service update function.', () => {
    it('Should update the power unit type.', async () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitType,
        description: 'updated',
      });
      const retPowerUnitType = await service.update(
        typeCode,
        updatePowerUnitTypeDto,
      );
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
      expect(retPowerUnitType.description).toEqual('updated');
    });
  });

  describe('Power unit type service remove function.', () => {
    it('Should delete the power unit type', async () => {
      const deleteResult = await service.remove(typeCode);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
