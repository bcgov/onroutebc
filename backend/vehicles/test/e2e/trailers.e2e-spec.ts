import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Trailer } from '../../src/modules/trailers/entities/trailer.entity';
import { TrailersModule } from '../../src/modules/trailers/trailers.module';
import {
  createTrailerDtoMock,
  readTrailerDtoMock,
  trailerEntityMock,
  updateTrailerDtoMock,
} from '../util/mocks/data/trailer.mock';

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
      repo.save.mockResolvedValue(trailerEntityMock);
      return request(app.getHttpServer())
        .post('/vehicles/trailers')
        .send(createTrailerDtoMock)
        .expect(201)
        .expect(readTrailerDtoMock);
    });
  });

  describe('/vehicles/trailers GETALL', () => {
    it('should return an array of trailers', () => {
      repo.find.mockResolvedValue([trailerEntityMock]);
      return request(app.getHttpServer())
        .get('/vehicles/trailers')
        .expect(200)
        .expect([readTrailerDtoMock]);
    });
  });

  describe('/vehicles/trailers/1 GET', () => {
    it('should return a trailer with trailerId as 1.', () => {
      repo.findOne.mockResolvedValue(trailerEntityMock);
      return request(app.getHttpServer())
        .get('/vehicles/trailers/1')
        .expect(200)
        .expect(readTrailerDtoMock);
    });
  });

  describe('/vehicles/trailers/1 UPDATE', () => {
    it('should update the trailer.', () => {
      repo.findOne.mockResolvedValue({
        ...trailerEntityMock,
        unitNumber: 'KEN2',
      });
      return request(app.getHttpServer())
        .put('/vehicles/trailers/1')
        .send(updateTrailerDtoMock)
        .expect(200)
        .expect({ ...readTrailerDtoMock, unitNumber: 'KEN2' });
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
