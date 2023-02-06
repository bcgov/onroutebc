import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';

import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { TrailerType } from '../../src/modules/vehicles/trailer-types/entities/trailer-type.entity';
import { TrailerTypesModule } from '../../src/modules/vehicles/trailer-types/trailer-types.module';
import {
  createTrailerTypeDtoMock,
  readTrailerTypeDtoMock,
  trailerTypeEntityMock,
  updateTrailerTypeDtoMock,
} from '../util/mocks/data/trailer-type.mock';

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
      repo.findOne.mockResolvedValue(trailerTypeEntityMock);
      return request(app.getHttpServer())
        .post('/vehicles/trailer-types')
        .send(createTrailerTypeDtoMock)
        .expect(201)
        .expect(readTrailerTypeDtoMock);
    });
  });

  describe('/vehicles/trailer-types GETALL', () => {
    it('should return an array of trailer types', () => {
      repo.find.mockResolvedValue([trailerTypeEntityMock]);
      return request(app.getHttpServer())
        .get('/vehicles/trailer-types')
        .expect(200)
        .expect([readTrailerTypeDtoMock]);
    });
  });

  describe('/vehicles/trailer-types/CONCRET GET', () => {
    it('should return a trailer type with trailerId as 1.', () => {
      repo.findOne.mockResolvedValue(trailerTypeEntityMock);
      return request(app.getHttpServer())
        .get('/vehicles/trailer-types/CONCRET')
        .expect(200)
        .expect(readTrailerTypeDtoMock);
    });
  });

  describe('/vehicles/trailer-types/CONCRET UPDATE', () => {
    it('should update the trailer type.', () => {
      repo.findOne.mockResolvedValue({
        ...trailerTypeEntityMock,
        description: 'updated',
      });
      return request(app.getHttpServer())
        .put('/vehicles/trailer-types/CONCRET')
        .send(updateTrailerTypeDtoMock)
        .expect(200)
        .expect({ ...readTrailerTypeDtoMock, description: 'updated' });
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
