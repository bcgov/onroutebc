/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from '../../common/exception/data-not-found.exception';
import { CreateTrailerTypeDto } from './dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/request/update-trailer-type.dto';
import { ReadTrailerTypeDto } from './dto/response/read-trailer-type.dto';
import { TrailerTypesController } from './trailer-types.controller';
import { TrailerTypesService } from './trailer-types.service';

const typeCode = 'BOOSTER';
const type = 'Boosters';
const description =
  'A Booster is similar to a jeep, but it is used behind a load.';
const sortOrder = '1';

const createTrailerTypeDto: CreateTrailerTypeDto = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
};

const updateTrailerTypeDto: UpdateTrailerTypeDto = {
  ...createTrailerTypeDto,
  description: 'updated',
};

const readTrailerTypeDto: ReadTrailerTypeDto = {
  ...createTrailerTypeDto,
};

describe('TrailerTypesController', () => {
  let controller: TrailerTypesController;

  const mockTrailerTypesService = {
    create: jest.fn().mockResolvedValue(readTrailerTypeDto),
    findAll: jest.fn().mockResolvedValue([readTrailerTypeDto]),
    findOne: jest.fn(async (id: string) => {
      if (id === readTrailerTypeDto.typeCode) {
        return readTrailerTypeDto;
      } else {
        return null;
      }
    }),
    update: jest.fn(
      async (id: string, updateTrailerTypeDto: UpdateTrailerTypeDto) => {
        if (id === typeCode) {
          Object.assign(readTrailerTypeDto, updateTrailerTypeDto);
          return readTrailerTypeDto;
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
      controllers: [TrailerTypesController],
      providers: [
        { provide: TrailerTypesService, useValue: mockTrailerTypesService },
      ],
    }).compile();

    controller = module.get<TrailerTypesController>(TrailerTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Trailer types controller create function.', () => {
    it('Create trailer type.', async () => {
      const retTrailerType = await controller.create(createTrailerTypeDto);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
      expect(mockTrailerTypesService.create).toHaveBeenCalledWith(
        createTrailerTypeDto,
      );
    });
  });

  describe('Trailer types controller findAll function.', () => {
    it('Successfully return all the trailer types.', async () => {
      const retTrailerTypes = await controller.findAll();
      expect(typeof retTrailerTypes).toBe('object');
      expect(retTrailerTypes[0].typeCode).toBe(typeCode);
      expect(retTrailerTypes.length).toBe(1);
    });
  });

  describe('Trailer types controller findOne function.', () => {
    it('Should return the trailer type by type code.', async () => {
      const retTrailerType = await controller.findOne(typeCode);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
      expect(mockTrailerTypesService.findOne).toHaveBeenCalledWith(typeCode);
    });

    it('Should throw an DataNotFoundException if trailer type is not found.', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer types controller update function.', () => {
    it('Should update the trailer type.', async () => {
      const retTrailerType = await controller.update(
        typeCode,
        updateTrailerTypeDto,
      );
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
      expect(retTrailerType.description).toEqual('updated');
      expect(mockTrailerTypesService.update).toHaveBeenCalledWith(
        typeCode,
        updateTrailerTypeDto,
      );
    });

    it('Should thrown an exception if the trailer type is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updateTrailerTypeDto);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer types controller remove function.', () => {
    it('Should delete the Power Unit type', async () => {
      const deleteResult = await controller.remove(typeCode);
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(mockTrailerTypesService.remove).toHaveBeenCalledWith(typeCode);
    });

    it('Should thrown an exception if the given trailer type is not found for deletion.', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
