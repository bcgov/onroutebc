import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../../common/entities/province.entity';
import { TrailerType } from '../trailer-types/entities/trailer-type.entity';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { Trailer } from './entities/trailer.entity';
import { TrailersProfile } from './profiles/trailer.profile';
import { TrailersService } from './trailers.service';

const trailerId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const emptyTrailerWidth = 3.2;

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: new Date(),
  updatedUser: 'user1',
  updatedDateTime: new Date(),
};

const province: Province = {
  provinceId: 'CA-BC',
  provinceCode: 'BC',
  provinceName: 'British Columbia',
  sortOrder: '1',
  country: null,
  powerUnits: null,
  trailers: null,
  ...base,
};

const trailerType: TrailerType = {
  typeCode: 'BOOSTER',
  type: 'Boosters',
  description: 'A Booster is similar to a jeep, but it is used behind a load.',
  sortOrder: '1',
  isActive: '1',
  trailers: null,
  ...base,
};

const createTrailerDto: CreateTrailerDto = {
  provinceId: province.provinceId,
  trailerTypeCode: trailerType.typeCode,
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  emptyTrailerWidth: emptyTrailerWidth,
};

const updateTrailerDto: UpdateTrailerDto = {
  ...createTrailerDto,
  unitNumber: 'KEN2',
};

const trailer: Trailer = {
  trailerId: trailerId,
  province: { ...province },
  trailerType: { ...trailerType },
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  emptyTrailerWidth: emptyTrailerWidth,
  ...base,
};

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

  describe('Trailer service create function.', () => {
    it('Create trailer.', async () => {
      repo.save.mockResolvedValue(trailer);
      const retTrailers = await service.create(createTrailerDto);
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers.trailerId).toBe('1');
    });
  });

  describe('Trailer service findAll function.', () => {
    it('Successfully return all the trailers.', async () => {
      repo.find.mockResolvedValue([trailer]);
      const retTrailers = await service.findAll();
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers[0].trailerId).toBe('1');
    });
  });

  describe('Trailer service findOne function.', () => {
    it('Should return the trailer by Id.', async () => {
      repo.findOne.mockResolvedValue(trailer);
      const retTrailers = await service.findOne('1');
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers.trailerId).toBe('1');
    });
  });

  describe('Trailer service update function.', () => {
    it('Should update the trailer.', async () => {
      repo.findOne.mockResolvedValue({ ...trailer, unitNumber: 'KEN2' });
      const retTrailers = await service.update('1', updateTrailerDto);
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers.trailerId).toBe('1');
      expect(retTrailers.unitNumber).toEqual('KEN2');
    });
  });

  describe('Trailer service remove function.', () => {
    it('Should delete the trailer', async () => {
      const deleteResult = await service.remove('1');
      expect(typeof deleteResult).toBe('object');
    });
  });
});
