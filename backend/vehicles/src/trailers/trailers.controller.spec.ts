/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { TrailersController } from './trailers.controller';
import { TrailersService } from './trailers.service';

const trailerId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const emptyTrailerWidth = 3.2;
const provinceId = 'CA-BC';
const trailerTypeCode = 'BOOSTER';

const createTrailerDto: CreateTrailerDto = {
  provinceId: provinceId,
  trailerTypeCode: trailerTypeCode,
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

const readTrailerDto: ReadTrailerDto = {
  trailerId: trailerId,
  createdDateTime: Date.now.toString(),
  ...createTrailerDto,
};

describe('TrailersController', () => {
  let controller: TrailersController;

  const mockTrailersService = {
    create: jest.fn().mockResolvedValue(readTrailerDto),
    findAll: jest.fn().mockResolvedValue([readTrailerDto]),
    findOne: jest.fn(async (id: string) => {
      if (id === readTrailerDto.trailerId) {
        return readTrailerDto;
      } else {
        return null;
      }
    }),
    update: jest.fn(async (id: string, updateTrailerDto: UpdateTrailerDto) => {
      if (id === '1') {
        Object.assign(readTrailerDto, updateTrailerDto);
        return readTrailerDto;
      } else {
        return null;
      }
    }),
    remove: jest.fn(async (id: string) => {
      if (id === '1') {
        return { affected: 1 };
      } else {
        return { affected: 0 };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailersController],
      providers: [{ provide: TrailersService, useValue: mockTrailersService }],
    }).compile();

    controller = module.get<TrailersController>(TrailersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('Trailer controller create function.', () => {
    it('Create trailer.', async () => {
      const retTrailer = await controller.create(createTrailerDto);
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe('1');
      expect(mockTrailersService.create).toHaveBeenCalledWith(createTrailerDto);
    });
  });

  describe('Trailer controller findAll function.', () => {
    it('Successfully return all the trailers.', async () => {
      const retTrailers = await controller.findAll();
      expect(typeof retTrailers).toBe('object');
      expect(retTrailers[0].trailerId).toBe('1');
      expect(retTrailers.length).toBe(1);
    });
  });

  describe('Trailer controller findOne function.', () => {
    it('Should return the trailer by Id.', async () => {
      const retTrailer = await controller.findOne('1');
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe('1');
      expect(mockTrailersService.findOne).toHaveBeenCalledWith('1');
    });

    it('Should throw an DataNotFoundException if trailer is not found.', async () => {
      await expect(async () => {
        await controller.findOne('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller update function.', () => {
    it('Should update the trailer.', async () => {
      const retTrailer = await controller.update('1', updateTrailerDto);
      expect(typeof retTrailer).toBe('object');
      expect(retTrailer.trailerId).toBe('1');
      expect(retTrailer.unitNumber).toEqual('KEN2');
      expect(mockTrailersService.update).toHaveBeenCalledWith(
        '1',
        updateTrailerDto,
      );
    });

    it('Should thrown an exception if the trailer is not found for update.', async () => {
      await expect(async () => {
        await controller.update('2', updateTrailerDto);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Trailer controller remove function.', () => {
    it('Should delete the trailer', async () => {
      const deleteResult = await controller.remove('1');
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(mockTrailersService.remove).toHaveBeenCalledWith('1');
    });

    it('Should thrown an exception if the given trailer is not found for deletion.', async () => {
      await expect(async () => {
        await controller.remove('2');
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
