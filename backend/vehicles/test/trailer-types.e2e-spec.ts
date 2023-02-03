import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';

import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { CreateTrailerTypeDto } from '../src/modules/trailer-types/dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from '../src/modules/trailer-types/dto/request/update-trailer-type.dto';
import { ReadTrailerTypeDto } from '../src/modules/trailer-types/dto/response/read-trailer-type.dto';
import { TrailerType } from '../src/modules/trailer-types/entities/trailer-type.entity';
import { TrailerTypesModule } from '../src/modules/trailer-types/trailer-types.module';

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

const readTrailerTypeDto: ReadTrailerTypeDto = {
  typeCode: typeCode,
  type: type,
  description: description,
};

describe('Trailer Types (e2e)', () => {
  let app: INestApplication;
  const repo = createMock<Repository<TrailerType>>();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TrailerTypesModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(TrailerType))
      .useValue(repo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/vehicles/trailer-types CREATE', () => {
    it('should create a new trailer type.', () => {
      repo.findOne.mockResolvedValue(trailerType);
      return request(app.getHttpServer())
        .post('/vehicles/trailer-types')
        .send(createTrailerTypeDto)
        .expect(201)
        .expect(readTrailerTypeDto);
    });
  });

  describe('/vehicles/trailer-types GETALL', () => {
    it('should return an array of trailer types', () => {
      repo.find.mockResolvedValue([trailerType]);
      return request(app.getHttpServer())
        .get('/vehicles/trailer-types')
        .expect(200)
        .expect([readTrailerTypeDto]);
    });
  });

  describe('/vehicles/trailer-types/CONCRET GET', () => {
    it('should return a trailer type with trailerId as 1.', () => {
      repo.findOne.mockResolvedValue(trailerType);
      return request(app.getHttpServer())
        .get('/vehicles/trailer-types/CONCRET')
        .expect(200)
        .expect(readTrailerTypeDto);
    });
  });

  describe('/vehicles/trailer-types/CONCRET UPDATE', () => {
    it('should update the trailer type.', () => {
      repo.findOne.mockResolvedValue({
        ...trailerType,
        description: 'updated',
      });
      return request(app.getHttpServer())
        .put('/vehicles/trailer-types/CONCRET')
        .send(updateTrailerTypeDto)
        .expect(200)
        .expect({ ...readTrailerTypeDto, description: 'updated' });
    });
  });

  describe('/vehicles/trailer-types/CONCRET DELETE', () => {
    it('should delete the trailer type.', () => {
      return request(app.getHttpServer())
        .delete('/vehicles/trailer-types/CONCRET')
        .expect(200)
        .expect({ deleted: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
