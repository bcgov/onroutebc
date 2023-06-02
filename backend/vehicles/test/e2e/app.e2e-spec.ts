import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PermitType } from 'src/modules/permit/entities/permit-type.entity';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PowerUnitTypesService } from 'src/modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from 'src/modules/vehicles/trailer-types/trailer-types.service';
import { CommonService } from 'src/modules/common/common.service';

let repo: DeepMocked<Repository<PermitType>>;
let powerUnitTypeServiceMock: DeepMocked<PowerUnitTypesService>;
let trailerTypeServiceMock: DeepMocked<TrailerTypesService>;
let commonServiceMock: DeepMocked<CommonService>;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    repo = createMock<Repository<PermitType>>();
    powerUnitTypeServiceMock = createMock<PowerUnitTypesService>();
    trailerTypeServiceMock = createMock<TrailerTypesService>();
    commonServiceMock = createMock<CommonService>();

    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
        {
          provide: getRepositoryToken(PermitType),
          useValue: repo,
        },
        {
          provide: PowerUnitTypesService,
          useValue: powerUnitTypeServiceMock,
        },
        {
          provide: TrailerTypesService,
          useValue: trailerTypeServiceMock,
        },
        {
          provide: CommonService,
          useValue: commonServiceMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () =>
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Vehicles Healthcheck!'));
});
