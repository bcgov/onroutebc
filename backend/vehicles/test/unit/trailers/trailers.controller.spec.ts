import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { TrailersController } from '../../../src/modules/vehicles/trailers/trailers.controller';
import { TrailersService } from '../../../src/modules/vehicles/trailers/trailers.service';
import {
  createTrailerDtoMock,
  readTrailerDtoMock,
  updateTrailerDtoMock,
} from '../../util/mocks/data/trailer.mock';
import { trailersServiceMock } from '../../util/mocks/service/trailers.service.mock';

const TRAILER_ID_1 = '1';
const TRAILER_ID_2 = '2';
const COMPANY_ID_1 = 1;

describe('TrailersController', () => {
  let controller: TrailersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailersController],
      providers: [{ provide: TrailersService, useValue: trailersServiceMock }],
    }).compile();

    controller = module.get<TrailersController>(TrailersController);
  });

  it('Trailer controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('Trailer controller create function', () => {
    it('should create trailer', async () => {
      const retTrailer = await controller.create(createTrailerDtoMock);
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer).toEqual(readTrailerDtoMock);
      expect(trailersServiceMock.create).toHaveBeenCalledWith(
        createTrailerDtoMock,
      );
    });
  });

  describe('Trailer controller findAll function', () => {
    it('should return all the trailers', async () => {
      const retTrailers = await controller.findAll(null, COMPANY_ID_1);
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers).toContain(readTrailerDtoMock);
      expect(retTrailers.length).toBe(1);
    });
  });

  describe('Trailer controller findOne function', () => {
    it('should return the trailer', async () => {
      const retTrailer = await controller.findOne(
        null,
        COMPANY_ID_1,
        TRAILER_ID_1,
      );
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer).toEqual(readTrailerDtoMock);
      expect(trailersServiceMock.findOne).toHaveBeenCalledWith(TRAILER_ID_1);
    });

    it('should throw an DataNotFoundException if trailer is not found', async () => {
      await expect(async () => {
        await controller.findOne(null, COMPANY_ID_1, TRAILER_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller update function', () => {
    it('should update the trailer', async () => {
      const retTrailer = await controller.update(
        null,
        COMPANY_ID_1,
        TRAILER_ID_1,
        updateTrailerDtoMock,
      );
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer).toEqual({ ...readTrailerDtoMock, unitNumber: 'KEN2' });
      expect(trailersServiceMock.update).toHaveBeenCalledWith(
        TRAILER_ID_1,
        updateTrailerDtoMock,
      );
    });

    it('should thrown a DataNotFoundException if the trailer is not found', async () => {
      await expect(async () => {
        await controller.update(
          null,
          COMPANY_ID_1,
          TRAILER_ID_2,
          updateTrailerDtoMock,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller remove function.', () => {
    it('should delete the trailer', async () => {
      const deleteResult = await controller.remove(
        null,
        COMPANY_ID_1,
        TRAILER_ID_1,
      );
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(trailersServiceMock.remove).toHaveBeenCalledWith(TRAILER_ID_1);
    });

    it('should thrown a DataNotFoundException if the trailer is not found', async () => {
      await expect(async () => {
        await controller.remove(null, COMPANY_ID_1, TRAILER_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
