import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrailerType } from '../../../src/modules/trailer-types/entities/trailer-type.entity';
import { TrailerTypesProfile } from '../../../src/modules/trailer-types/profiles/trailer-type.profile';
import { TrailerTypesService } from '../../../src/modules/trailer-types/trailer-types.service';
import {
  createTrailerTypeDtoMock,
  trailerTypeEntityMock,
  updateTrailerTypeDtoMock,
} from '../../util/mocks/data/trailer-type.mock';

const TYPE_CODE = 'BOOSTER';

describe('TrailerTypesService', () => {
  let service: TrailerTypesService;
  const repo = createMock<Repository<TrailerType>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailerTypesService,
        {
          provide: getRepositoryToken(TrailerType),
          useValue: repo,
        },
        {
          provide: getMapperToken(),
          useValue: createMapper({
            strategyInitializer: classes(),
          }),
        },
        TrailerTypesProfile,
      ],
    }).compile();

    service = module.get<TrailerTypesService>(TrailerTypesService);
  });

  it('Trailer types service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Trailer type service create function', () => {
    it('should create a trailer type', async () => {
      repo.findOne.mockResolvedValue(trailerTypeEntityMock);
      const retTrailerType = await service.create(createTrailerTypeDtoMock);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Trailer service type findAll function', () => {
    it('should return all the trailer types', async () => {
      repo.find.mockResolvedValue([trailerTypeEntityMock]);
      const retTrailerTypes = await service.findAll();
      expect(typeof retTrailerTypes).toBe('object');
      expect(retTrailerTypes[0].typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Trailer type service findOne function', () => {
    it('should return the trailer type', async () => {
      repo.findOne.mockResolvedValue(trailerTypeEntityMock);
      const retTrailerType = await service.findOne(TYPE_CODE);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(TYPE_CODE);
    });
  });

  describe('Trailer type service update function', () => {
    it('should update the trailer type', async () => {
      repo.findOne.mockResolvedValue({
        ...trailerTypeEntityMock,
        description: 'updated',
      });
      const retTrailerType = await service.update(
        TYPE_CODE,
        updateTrailerTypeDtoMock,
      );
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(TYPE_CODE);
      expect(retTrailerType.description).toEqual('updated');
    });
  });

  describe('Trailer type service remove function', () => {
    it('should delete the trailer type', async () => {
      const deleteResult = await service.remove(TYPE_CODE);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
