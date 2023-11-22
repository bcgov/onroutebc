import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import { TrailersController } from '../../../src/modules/vehicles/trailers/trailers.controller';
import { TrailersService } from '../../../src/modules/vehicles/trailers/trailers.service';
import {
  createTrailerDtoMock,
  deleteTrailersMock,
  readTrailerDtoMock,
  updateTrailerDtoMock,
} from '../../util/mocks/data/trailer.mock';
import { trailersServiceMock } from '../../util/mocks/service/trailers.service.mock';
import { deleteDtoMock } from '../../util/mocks/data/delete-dto.mock';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { redCompanyCvClientUserJWTMock } from 'test/util/mocks/data/jwt.mock';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { getDirectory } from 'src/common/helper/auth.helper';

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
      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;
      const currentUser = request.user as IUserJWT;
      const retTrailer = await controller.create(
        request,
        COMPANY_ID_1,
        createTrailerDtoMock,
      );
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer).toEqual(readTrailerDtoMock);
      expect(trailersServiceMock.create).toHaveBeenCalledWith(
        COMPANY_ID_1,
        createTrailerDtoMock,
        currentUser,
        getDirectory(currentUser),
      );
    });
  });

  describe('Trailer controller findAll function', () => {
    it('should return all the trailers', async () => {
      const retTrailers = await controller.findAll(COMPANY_ID_1);
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
    });

    it('should throw an DataNotFoundException if trailer is not found', async () => {
      await expect(async () => {
        await controller.findOne(null, COMPANY_ID_1, TRAILER_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller update function', () => {
    it('should update the trailer', async () => {
      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;
      const currentUser = request.user as IUserJWT;

      const retTrailer = await controller.update(
        request,
        COMPANY_ID_1,
        TRAILER_ID_1,
        updateTrailerDtoMock,
      );
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer).toEqual({ ...readTrailerDtoMock, unitNumber: 'KEN2' });
      expect(trailersServiceMock.update).toHaveBeenCalledWith(
        COMPANY_ID_1,
        TRAILER_ID_1,
        updateTrailerDtoMock,
        currentUser,
        getDirectory(currentUser),
      );
    });

    it('should thrown a DataNotFoundException if the trailer is not found', async () => {
      await expect(async () => {
        const request = createMock<Request>();
        request.user = redCompanyCvClientUserJWTMock;
        await controller.update(
          request,
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
      expect(trailersServiceMock.remove).toHaveBeenCalledWith(
        COMPANY_ID_1,
        TRAILER_ID_1,
      );
    });

    it('should thrown a DataNotFoundException if the trailer is not found', async () => {
      await expect(async () => {
        await controller.remove(null, COMPANY_ID_1, TRAILER_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller bulk delete function.', () => {
    it('should delete the trailer', async () => {
      const deleteResult = await controller.deleteTrailers(
        deleteTrailersMock,
        COMPANY_ID_1,
      );
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.success).toBeTruthy();
      expect(deleteResult.failure).toBeTruthy();
      expect(deleteResult).toEqual(deleteDtoMock);
      expect(trailersServiceMock.removeAll).toHaveBeenCalledWith(
        deleteTrailersMock.trailers,
        COMPANY_ID_1,
      );
    });

    it('should thrown a DataNotFoundException if the trailer is not found', async () => {
      await expect(async () => {
        deleteTrailersMock.trailers = [TRAILER_ID_2];
        await controller.deleteTrailers(deleteTrailersMock, COMPANY_ID_1);
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
