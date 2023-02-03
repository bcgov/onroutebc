import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Province } from '../src/common/entities/province.entity';
import { TrailerType } from '../src/trailer-types/entities/trailer-type.entity';
import { CreateTrailerDto } from '../src/trailers/dto/request/create-trailer.dto';
import { UpdateTrailerDto } from '../src/trailers/dto/request/update-trailer.dto';
import { ReadTrailerDto } from '../src/trailers/dto/response/read-trailer.dto';
import { Trailer } from '../src/trailers/entities/trailer.entity';
import { TrailersModule } from '../src/trailers/trailers.module';

const trailerId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const emptyTrailerWidth = 3.2;
const date = new Date();

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: date,
  updatedUser: 'user1',
  updatedDateTime: date,
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

const readTrailerDto: ReadTrailerDto = {
  ...createTrailerDto,
  trailerId: '1',
  createdDateTime: date.toISOString(),
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

describe('Trailers (e2e)', () => {
  let app: INestApplication;
  const repo = createMock<Repository<Trailer>>();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TrailersModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(Trailer))
      .useValue(repo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/vehicles/trailers CREATE', () => {
    it('should create a new trailer.', () => {
      repo.save.mockResolvedValue(trailer);
      return request(app.getHttpServer())
        .post('/vehicles/trailers')
        .send(createTrailerDto)
        .expect(201)
        .expect(readTrailerDto);
    });
  });

  describe('/vehicles/trailers GETALL', () => {
    it('should return an array of trailers', () => {
      repo.find.mockResolvedValue([trailer]);
      return request(app.getHttpServer())
        .get('/vehicles/trailers')
        .expect(200)
        .expect([readTrailerDto]);
    });
  });

  describe('/vehicles/trailers/1 GET', () => {
    it('should return a trailer with trailerId as 1.', () => {
      repo.findOne.mockResolvedValue(trailer);
      return request(app.getHttpServer())
        .get('/vehicles/trailers/1')
        .expect(200)
        .expect(readTrailerDto);
    });
  });

  describe('/vehicles/trailers/1 UPDATE', () => {
    it('should update the trailer.', () => {
      repo.findOne.mockResolvedValue({ ...trailer, unitNumber: 'KEN2' });
      return request(app.getHttpServer())
        .put('/vehicles/trailers/1')
        .send(updateTrailerDto)
        .expect(200)
        .expect({ ...readTrailerDto, unitNumber: 'KEN2' });
    });
  });

  describe('/vehicles/trailers/1 DELETE', () => {
    it('should delete the trailer.', () => {
      return request(app.getHttpServer())
        .delete('/vehicles/trailers/1')
        .expect(200)
        .expect({ deleted: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
