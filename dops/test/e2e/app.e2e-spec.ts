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

let dgenServiceMock: DeepMocked<DgenService>;
let s3ServiceMock: DeepMocked<S3Service>;
let dmsServiceMock: DeepMocked<DmsService>;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    dgenServiceMock = createMock<DgenService>();
    s3ServiceMock = createMock<S3Service>();
    dmsServiceMock = createMock<DmsService>();
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () =>
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('DOPS Healthcheck!'));
});
