import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DgenService } from '../../src/modules/dgen/dgen.service';
import { DmsService } from '../../src/modules/dms/dms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { S3Service } from '../../src/modules/common/s3.service';
import { App } from 'supertest/types';
import { FeatureFlagsService } from '../../src/modules/feature-flags/feature-flags.service';

let dgenServiceMock: DeepMocked<DgenService>;
let s3ServiceMock: DeepMocked<S3Service>;
let dmsServiceMock: DeepMocked<DmsService>;
let featureFlagsService: DeepMocked<FeatureFlagsService>;

describe('AppController (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    dgenServiceMock = createMock<DgenService>();
    s3ServiceMock = createMock<S3Service>();
    dmsServiceMock = createMock<DmsService>();
    featureFlagsService = createMock<FeatureFlagsService>();
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
        {
          provide: DgenService,
          useValue: dgenServiceMock,
        },
        {
          provide: S3Service,
          useValue: s3ServiceMock,
        },
        {
          provide: DmsService,
          useValue: dmsServiceMock,
        },
        {
          provide: FeatureFlagsService,
          useValue: featureFlagsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () =>
    request(app.getHttpServer() as unknown as App)
      .get('/')
      .expect(200)
      .expect('DOPS Healthcheck!'));
});
