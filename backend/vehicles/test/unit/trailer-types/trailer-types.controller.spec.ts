import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { TrailerTypesController } from '../../../src/modules/trailer-types/trailer-types.controller';
import { TrailerTypesService } from '../../../src/modules/trailer-types/trailer-types.service';
import {
  createTrailerTypeDtoMock,
  readTrailerTypeDtoMock,
  updateTrailerTypeDtoMock,
} from '../../util/mocks/data/trailer-type.mock';
import { trailerTypesServiceMock } from '../../util/mocks/service/trailer-types.service.mock';

const TYPE_CODE = 'BOOSTER';

describe('TrailerTypesController', () => {
  let controller: TrailerTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailerTypesController],
      providers: [
        { provide: TrailerTypesService, useValue: trailerTypesServiceMock },
      ],
    }).compile();

    controller = module.get<TrailerTypesController>(TrailerTypesController);
  });

  it('Trailer types controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Trailer types controller create function', () => {
    it('should create a trailer type.', async () => {
      const retTrailerType = await controller.create(createTrailerTypeDtoMock);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType).toEqual(readTrailerTypeDtoMock);
      expect(trailerTypesServiceMock.create).toHaveBeenCalledWith(
        createTrailerTypeDtoMock,
      );
    });
  });

  describe('Trailer types controller findAll function', () => {
    it('should return all the trailer types', async () => {
      const retTrailerTypes = await controller.findAll();
      expect(typeof retTrailerTypes).toBe('object');
      expect(retTrailerTypes[0].typeCode).toBe(TYPE_CODE);
      expect(retTrailerTypes.length).toBe(1);
    });
  });

  describe('Trailer types controller findOne function', () => {
    it('should return the trailer type', async () => {
      const retTrailerType = await controller.findOne(TYPE_CODE);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType).toEqual(readTrailerTypeDtoMock);
      expect(trailerTypesServiceMock.findOne).toHaveBeenCalledWith(TYPE_CODE);
    });

    it('Should throw an DataNotFoundException if trailer type is not found.', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer types controller update function', () => {
    it('should update the trailer type', async () => {
      const retTrailerType = await controller.update(
        TYPE_CODE,
        updateTrailerTypeDtoMock,
      );
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType).toEqual({
        ...readTrailerTypeDtoMock,
        description: 'updated',
      });
      expect(trailerTypesServiceMock.update).toHaveBeenCalledWith(
        TYPE_CODE,
        updateTrailerTypeDtoMock,
      );
    });

    it('Should thrown a DataNotFoundException if the trailer type is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updateTrailerTypeDtoMock);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer types controller remove function', () => {
    it('should delete the trailer type', async () => {
      const deleteResult = await controller.remove(TYPE_CODE);
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(trailerTypesServiceMock.remove).toHaveBeenCalledWith(TYPE_CODE);
    });

    it('Should thrown an DataNotFoundException if the given trailer type is not found for deletion', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
