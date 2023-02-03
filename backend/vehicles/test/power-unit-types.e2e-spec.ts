import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { CreatePowerUnitTypeDto } from '../src/modules/power-unit-types/dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from '../src/modules/power-unit-types/dto/request/update-power-unit-type.dto';
import { ReadPowerUnitTypeDto } from '../src/modules/power-unit-types/dto/response/read-power-unit-type.dto';
import { PowerUnitType } from '../src/modules/power-unit-types/entities/power-unit-type.entity';
import { PowerUnitTypesModule } from '../src/modules/power-unit-types/power-unit-types.module';

const typeCode = 'CONCRET';
const type = 'Concrete Pumper Trucks';
const description =
  'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.';
const sortOrder = '1';
const isActive = '1';

const base = {
  concurrencyControlNumber: 1,
  createdUser: 'user1',
  createdDateTime: new Date(),
  updatedUser: 'user1',
  updatedDateTime: new Date(),
};

const powerUnitType: PowerUnitType = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
  isActive: isActive,
  powerUnits: null,
  ...base,
};

const createPowerUnitTypeDto: CreatePowerUnitTypeDto = {
  typeCode: typeCode,
  type: type,
  description: description,
  sortOrder: sortOrder,
};

const updatePowerUnitTypeDto: UpdatePowerUnitTypeDto = {
  ...createPowerUnitTypeDto,
  description: 'updated',
};

const readPowerUnitTypeDto: ReadPowerUnitTypeDto = {
  typeCode: typeCode,
  type: type,
  description: description,
};

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
      repo.findOne.mockResolvedValue(powerUnitType);
      return request(app.getHttpServer())
        .post('/vehicles/power-unit-types')
        .send(createPowerUnitTypeDto)
        .expect(201)
        .expect(readPowerUnitTypeDto);
    });
  });

  describe('/vehicles/power-unit-types GETALL', () => {
    it('should return an array of power unit types', () => {
      repo.find.mockResolvedValue([powerUnitType]);
      return request(app.getHttpServer())
        .get('/vehicles/power-unit-types')
        .expect(200)
        .expect([readPowerUnitTypeDto]);
    });
  });

  describe('/vehicles/power-unit-types/CONCRET GET', () => {
    it('should return a power unit type with powerUnitId as 1.', () => {
      repo.findOne.mockResolvedValue(powerUnitType);
      return request(app.getHttpServer())
        .get('/vehicles/power-unit-types/CONCRET')
        .expect(200)
        .expect(readPowerUnitTypeDto);
    });
  });

  describe('/vehicles/power-unit-types/CONCRET UPDATE', () => {
    it('should update the power unit type.', () => {
      repo.findOne.mockResolvedValue({
        ...powerUnitType,
        description: 'updated',
      });
      return request(app.getHttpServer())
        .put('/vehicles/power-unit-types/CONCRET')
        .send(updatePowerUnitTypeDto)
        .expect(200)
        .expect({ ...readPowerUnitTypeDto, description: 'updated' });
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
