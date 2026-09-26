import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FeatureFlagsService } from '@modules/feature-flags/feature-flags.service';

let featureFlagsService: DeepMocked<FeatureFlagsService>;

describe('AppController (e2e)', () => {
  let app: INestApplication;

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

  it('/ (GET)', () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    return request(server).get('/').expect(200).expect('Policy Healthcheck!');
  });
});
