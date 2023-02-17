import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trailer } from '../../../src/modules/vehicles/trailers/entities/trailer.entity';
import { TrailersProfile } from '../../../src/modules/vehicles/trailers/profiles/trailer.profile';
import { TrailersService } from '../../../src/modules/vehicles/trailers/trailers.service';
import {
  createTrailerDtoMock,
  trailerEntityMock,
  updateTrailerDtoMock,
} from '../../util/mocks/data/trailer.mock';

const TRAILER_ID_1 = '1';

describe('TrailersService', () => {
  let service: TrailersService;
  const repo = createMock<Repository<Trailer>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailersService,
        {
          provide: getRepositoryToken(Trailer),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        TrailersProfile,
      ],
    }).compile();

    service = module.get<TrailersService>(TrailersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Trailer service create function', () => {
    it('Should create a trailer', async () => {
      repo.save.mockResolvedValue(trailerEntityMock);
      const retTrailer = await service.create(createTrailerDtoMock);
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe(TRAILER_ID_1);
    });
  });

  describe('Trailer service findAll function', () => {
    it('should return all the trailers', async () => {
      repo.find.mockResolvedValue([trailerEntityMock]);
      const retTrailers = await service.findAll();
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers[0].trailerId).toBe(TRAILER_ID_1);
    });
  });

  describe('Trailer service findOne function', () => {
    it('should return the trailer', async () => {
      repo.findOne.mockResolvedValue(trailerEntityMock);
      const retTrailer = await service.findOne(TRAILER_ID_1);
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe(TRAILER_ID_1);
    });
  });

  describe('Trailer service update function', () => {
    it('should update the trailer', async () => {
      repo.findOne.mockResolvedValue({
        ...trailerEntityMock,
        unitNumber: 'KEN2',
      });
      const retTrailer = await service.update(
        TRAILER_ID_1,
        updateTrailerDtoMock,
      );
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe(TRAILER_ID_1);
      expect(retTrailer.unitNumber).toEqual('KEN2');
    });
  });

  describe('Trailer service remove function', () => {
    it('should delete the trailer', async () => {
      const deleteResult = await service.remove(TRAILER_ID_1);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
