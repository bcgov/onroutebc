import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { App } from 'supertest/types';
import { FeatureFlagsService } from '../../src/modules/feature-flags/feature-flags.service';

let featureFlagsService: DeepMocked<FeatureFlagsService>;

describe('AppController (e2e)', () => {
  let app: INestApplication<Express.Application>;

  beforeAll(async () => {
    featureFlagsService = createMock<FeatureFlagsService>();
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: CACHE_MANAGER, useFactory: jest.fn() },
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
