import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppService } from '../../../src/app.service';
import { DgenService } from '../../../src/modules/dgen/dgen.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ComsService } from '../../../src/modules/common/coms.service';
import { DmsService } from '../../../src/modules/dms/dms.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AppController', () => {
  let appController: AppController;

  let dgenServiceMock: DeepMocked<DgenService>;
  let comsServiceMock: DeepMocked<ComsService>;
  let dmsServiceMock: DeepMocked<DmsService>;

  beforeEach(async () => {
    dgenServiceMock = createMock<DgenService>();
    comsServiceMock = createMock<ComsService>();
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
          provide: ComsService,
          useValue: comsServiceMock,
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
