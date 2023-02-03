import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrailerTypeDto } from './dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/request/update-trailer-type.dto';
import { TrailerType } from './entities/trailer-type.entity';
import { TrailerTypesProfile } from './profiles/trailer-type.profile';
import { TrailerTypesService } from './trailer-types.service';

const typeCode = 'BOOSTER';
const type = 'Boosters';
const description =
  'A Booster is similar to a jeep, but it is used behind a load.';
const sortOrder = '1';
const isActive = '1';

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: new Date(),
  updatedUser: 'user1',
  updatedDateTime: new Date(),
};

const trailerType: TrailerType = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
  isActive: isActive,
  trailers: null,
  ...base,
};

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Trailer type service create function.', () => {
    it('Create trailer type.', async () => {
      repo.findOne.mockResolvedValue(trailerType);
      const retTrailerType = await service.create(createTrailerTypeDto);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
    });
  });

  describe('Trailer service type findAll function.', () => {
    it('Successfully return all the trailer types.', async () => {
      repo.find.mockResolvedValue([trailerType]);
      const retTrailerTypes = await service.findAll();
      expect(typeof retTrailerTypes).toBe('object');
      expect(retTrailerTypes[0].typeCode).toBe(typeCode);
    });
  });

  describe('Trailer type service findOne function.', () => {
    it('Should return the trailer type by typeCode.', async () => {
      repo.findOne.mockResolvedValue(trailerType);
      const retTrailerType = await service.findOne(typeCode);
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
    });
  });

  describe('Trailer type service update function.', () => {
    it('Should update the trailer type.', async () => {
      repo.findOne.mockResolvedValue({
        ...trailerType,
        description: 'updated',
      });
      const retTrailerType = await service.update(
        typeCode,
        updateTrailerTypeDto,
      );
      expect(typeof retTrailerType).toBe('object');
      expect(retTrailerType.typeCode).toBe(typeCode);
      expect(retTrailerType.description).toEqual('updated');
    });
  });

  describe('Trailer type service remove function.', () => {
    it('Should delete the trailer type', async () => {
      const deleteResult = await service.remove(typeCode);
      expect(typeof deleteResult).toBe('object');
    });
  });
});
