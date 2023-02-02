/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { CreatePowerUnitTypeDto } from './dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/request/update-power-unit-type.dto';
import { ReadPowerUnitTypeDto } from './dto/response/read-power-unit-type.dto';
import { PowerUnitTypesController } from './power-unit-types.controller';
import { PowerUnitTypesService } from './power-unit-types.service';

const typeCode = 'CONCRET';
const type = 'Concrete Pumper Trucks';
const description =
  'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.';
const sortOrder = '1';

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

const readPowerUnitTypeDto: ReadPowerUnitTypeDto = {
  ...createPowerUnitTypeDto,
};

describe('PowerUnitTypesController', () => {
  let controller: PowerUnitTypesController;

  const mockPowerUnitTypesService = {
    create: jest.fn().mockResolvedValue(readPowerUnitTypeDto),
    findAll: jest.fn().mockResolvedValue([readPowerUnitTypeDto]),
    findOne: jest.fn(async (id: string) => {
      if (id === readPowerUnitTypeDto.typeCode) {
        return readPowerUnitTypeDto;
      } else {
        return null;
      }
    }),
    update: jest.fn(
      async (id: string, updatePowerUnitTypeDto: UpdatePowerUnitTypeDto) => {
        if (id === typeCode) {
          Object.assign(readPowerUnitTypeDto, updatePowerUnitTypeDto);
          return readPowerUnitTypeDto;
        } else {
          return null;
        }
      },
    ),
    remove: jest.fn(async (id: string) => {
      if (id === typeCode) {
        return { affected: 1 };
      } else {
        return { affected: 0 };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitTypesController],
      providers: [
        { provide: PowerUnitTypesService, useValue: mockPowerUnitTypesService },
      ],
    }).compile();

    controller = module.get<PowerUnitTypesController>(PowerUnitTypesController);
  });

  it('Power Unit Types Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Power unit types controller create function.', () => {
    it('Create power unit type.', async () => {
      const retPowerUnitType = await controller.create(createPowerUnitTypeDto);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
      expect(mockPowerUnitTypesService.create).toHaveBeenCalledWith(
        createPowerUnitTypeDto,
      );
    });
  });

  describe('Power unit types controller findAll function.', () => {
    it('Successfully return all the power unit types.', async () => {
      const retPowerUnitTypes = await controller.findAll();
      expect(typeof retPowerUnitTypes).toBe('object');
      expect(retPowerUnitTypes[0].typeCode).toBe(typeCode);
      expect(retPowerUnitTypes.length).toBe(1);
    });
  });

  describe('Power unit types controller findOne function.', () => {
    it('Should return the power unit type by type code.', async () => {
      const retPowerUnitType = await controller.findOne(typeCode);
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
      expect(mockPowerUnitTypesService.findOne).toHaveBeenCalledWith(typeCode);
    });

    it('Should throw an DataNotFoundException if power unit type is not found.', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit types controller update function.', () => {
    it('Should update the power unit type.', async () => {
      const retPowerUnitType = await controller.update(
        typeCode,
        updatePowerUnitTypeDto,
      );
      expect(typeof retPowerUnitType).toBe('object');
      expect(retPowerUnitType.typeCode).toBe(typeCode);
      expect(retPowerUnitType.description).toEqual('updated');
      expect(mockPowerUnitTypesService.update).toHaveBeenCalledWith(
        typeCode,
        updatePowerUnitTypeDto,
      );
    });

    it('Should thrown an exception if the power unit type is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updatePowerUnitTypeDto);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit types controller remove function.', () => {
    it('Should delete the Power Unit type', async () => {
      const deleteResult = await controller.remove(typeCode);
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(mockPowerUnitTypesService.remove).toHaveBeenCalledWith(typeCode);
    });

    it('Should thrown an exception if the given power unit type is not found for deletion.', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
