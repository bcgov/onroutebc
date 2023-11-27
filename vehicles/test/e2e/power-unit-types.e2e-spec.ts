import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PowerUnitType } from '../../src/modules/vehicles/power-unit-types/entities/power-unit-type.entity';
import { PowerUnitTypesModule } from '../../src/modules/vehicles/power-unit-types/power-unit-types.module';
import {
  createPowerUnitTypeDtoMock,
  powerUnitTypeEntityMock,
  readPowerUnitTypeDtoMock,
  updatePowerUnitTypeDtoMock,
} from '../util/mocks/data/power-unit-type.mock';

describe('Power Unit Types (e2e)', () => {
  let app: INestApplication;
  const repo = createMock<Repository<PowerUnitType>>();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        PowerUnitTypesModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    })
      .overrideProvider(getRepositoryToken(PowerUnitType))
      .useValue(repo)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/vehicles/power-unit-types CREATE', () => {
    it('should create a new power unit type.', () => {
      repo.findOne.mockResolvedValue(powerUnitTypeEntityMock);
      return request(app.getHttpServer())
        .post('/vehicles/power-unit-types')
        .send(createPowerUnitTypeDtoMock)
        .expect(201)
        .expect(readPowerUnitTypeDtoMock);
    });
  });

  describe('/vehicles/power-unit-types GETALL', () => {
    it('should return an array of power unit types', () => {
      repo.find.mockResolvedValue([powerUnitTypeEntityMock]);
      return request(app.getHttpServer())
        .get('/vehicles/power-unit-types')
        .expect(200)
        .expect([readPowerUnitTypeDtoMock]);
    });
  });

  describe('/vehicles/power-unit-types/CONCRET GET', () => {
    it('should return a power unit type with powerUnitId as 1.', () => {
      repo.findOne.mockResolvedValue(powerUnitTypeEntityMock);
      return request(app.getHttpServer())
        .get('/vehicles/power-unit-types/CONCRET')
        .expect(200)
        .expect(readPowerUnitTypeDtoMock);
    });
  });

  describe('/vehicles/power-unit-types/CONCRET UPDATE', () => {
    it('should update the power unit type.', () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitTypeEntityMock,
        description: 'updated',
      });
      return request(app.getHttpServer())
        .put('/vehicles/power-unit-types/CONCRET')
        .send(updatePowerUnitTypeDtoMock)
        .expect(200)
        .expect({ ...readPowerUnitTypeDtoMock, description: 'updated' });
    });
  });

  describe('/vehicles/power-unit-types/CONCRET DELETE', () => {
    it('should delete the power unit type.', () => {
      return request(app.getHttpServer())
        .delete('/vehicles/power-unit-types/CONCRET')
        .expect(200)
        .expect({ deleted: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
