import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Province } from '../src/common/entities/province.entity';
import { PowerUnitType } from '../src/power-unit-types/entities/power-unit-type.entity';
import { CreatePowerUnitDto } from '../src/power-units/dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from '../src/power-units/dto/request/update-power-unit.dto';
import { ReadPowerUnitDto } from '../src/power-units/dto/response/read-power-unit.dto';
import { PowerUnit } from '../src/power-units/entities/power-unit.entity';
import { PowerUnitsModule } from '../src/power-units/power-units.module';

const powerUnitId = '1';
const unitNumber = 'KEN1';
const plate = 'AS 5895';
const year = 2010;
const make = 'Kenworth';
const vin = '1ZVFT80N475211367';
const licensedGvw = 35600;
const steerAxleTireSize = 32;
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

const powerUnitType: PowerUnitType = {
  typeCode: 'CONCRET',
  type: 'Concrete Pumper Trucks',
  description:
    'Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.',
  sortOrder: '1',
  isActive: '1',
  powerUnits: null,
  ...base,
};

const createPowerUnitDto: CreatePowerUnitDto = {
  provinceId: province.provinceId,
  powerUnitTypeCode: powerUnitType.typeCode,
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  licensedGvw: licensedGvw,
  steerAxleTireSize: steerAxleTireSize,
};

const updatePowerUnitDto: UpdatePowerUnitDto = {
  ...createPowerUnitDto,
  unitNumber: 'KEN2',
};

const readPowerUnitDto: ReadPowerUnitDto = {
  ...createPowerUnitDto,
  powerUnitId: '1',
  createdDateTime: date.toISOString(),
};

const powerUnit: PowerUnit = {
  powerUnitId: powerUnitId,
  province: { ...province },
  powerUnitType: { ...powerUnitType },
  unitNumber: unitNumber,
  plate: plate,
  year: year,
  make: make,
  vin: vin,
  licensedGvw: licensedGvw,
  steerAxleTireSize: steerAxleTireSize,
  ...base,
};

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

  describe('/vehicles/powerUnits CREATE', () => {
    it('should create a new power unit.', () => {
      repo.save.mockResolvedValue(powerUnit);
      return request(app.getHttpServer())
        .post('/vehicles/powerUnits')
        .send(createPowerUnitDto)
        .expect(201)
        .expect(readPowerUnitDto);
    });
  });

  describe('/vehicles/powerUnits GETALL', () => {
    it('should return an array of power units', () => {
      repo.find.mockResolvedValue([powerUnit]);
      return request(app.getHttpServer())
        .get('/vehicles/powerUnits')
        .expect(200)
        .expect([readPowerUnitDto]);
    });
  });

  describe('/vehicles/powerUnits/1 GET', () => {
    it('should return a power unit with powerUnitId as 1.', () => {
      repo.findOne.mockResolvedValue(powerUnit);
      return request(app.getHttpServer())
        .get('/vehicles/powerUnits/1')
        .expect(200)
        .expect(readPowerUnitDto);
    });
  });

  describe('/vehicles/powerUnits/1 UPDATE', () => {
    it('should update the power unit.', () => {
      repo.findOne.mockResolvedValue({ ...powerUnit, unitNumber: 'KEN2' });
      return request(app.getHttpServer())
        .put('/vehicles/powerUnits/1')
        .send(updatePowerUnitDto)
        .expect(200)
        .expect({ ...readPowerUnitDto, unitNumber: 'KEN2' });
    });
  });

  describe('/vehicles/powerUnits/1 DELETE', () => {
    it('should delete the power unit.', () => {
      return request(app.getHttpServer())
        .delete('/vehicles/powerUnits/1')
        .expect(200)
        .expect({ deleted: true });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
