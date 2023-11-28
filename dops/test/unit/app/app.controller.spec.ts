import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { DmsService } from '../../../src/modules/dms/dms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { S3Service } from '../../../src/modules/common/s3.service';
import { DgenService } from '../../../src/modules/dgen/dgen.service';

describe('AppController', () => {
  let appController: AppController;

  let dgenServiceMock: DeepMocked<DgenService>;
  let s3ServiceMock: DeepMocked<S3Service>;
  let dmsServiceMock: DeepMocked<DmsService>;

  beforeEach(async () => {
    dgenServiceMock = createMock<DgenService>();
    s3ServiceMock = createMock<S3Service>();
    dmsServiceMock = createMock<DmsService>();
    const app: TestingModule = await Test.createTestingModule({
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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "DOPS Healthcheck!"', () => {
      expect(appController.getHello()).toBe('DOPS Healthcheck!');
    });
  });
});
