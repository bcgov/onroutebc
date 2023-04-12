import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PowerUnit } from '../../src/modules/vehicles/power-units/entities/power-unit.entity';
import { PowerUnitsModule } from '../../src/modules/vehicles/power-units/power-units.module';
import {
  createPowerUnitDtoMock,
  powerUnitEntityMock,
  readPowerUnitDtoMock,
  updatePowerUnitDtoMock,
} from '../util/mocks/data/power-unit.mock';

describe('Power Units (e2e)', () => {
  let app: INestApplication;
  const repo = createMock<Repository<PowerUnit>>();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        PowerUnitsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(PowerUnit))
      .useValue(repo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/companies/1/vehicles/powerUnits CREATE', () => {
    it('should create a new power unit.', () => {
      repo.save.mockResolvedValue(powerUnitEntityMock);
      return request(app.getHttpServer())
        .post('/companies/1/vehicles/powerUnits')
        .send(createPowerUnitDtoMock)
        .expect(201)
        .expect(readPowerUnitDtoMock);
    });
  });

  describe('/companies/1/vehicles/powerUnits GETALL', () => {
    it('should return an array of power units', () => {
      repo.find.mockResolvedValue([powerUnitEntityMock]);
      return request(app.getHttpServer())
        .get('/companies/1/vehicles/powerUnits')
        .expect(200)
        .expect([readPowerUnitDtoMock]);
    });
  });

  describe('/vehicles/powerUnits/1 GET', () => {
    it('should return a power unit with powerUnitId as 1.', () => {
      repo.findOne.mockResolvedValue(powerUnitEntityMock);
      return request(app.getHttpServer())
        .get('/companies/1/vehicles/powerUnits/1')
        .expect(200)
        .expect(readPowerUnitDtoMock);
    });
  });

  describe('/companies/1/vehicles/powerUnits/1 UPDATE', () => {
    it('should update the power unit.', () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitEntityMock,
        unitNumber: 'KEN2',
      });
      return request(app.getHttpServer())
        .put('/companies/1/vehicles/powerUnits/1')
        .send(updatePowerUnitDtoMock)
        .expect(200)
        .expect({ ...readPowerUnitDtoMock, unitNumber: 'KEN2' });
    });
  });

  describe('/vehicles/powerUnits/1 DELETE', () => {
    it('should delete the power unit.', () => {
      return request(app.getHttpServer())
        .delete('/companies/1/vehicles/powerUnits/1')
        .expect(200)
        .expect({ deleted: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
