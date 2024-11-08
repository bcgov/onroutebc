import { Test, TestingModule } from '@nestjs/testing';
import { TpsPermitService } from '../../src/modules/tps-permit/tps-permit.service';
import { TpsPermit } from '../../src/modules/tps-permit/entities/tps-permit.entity';
import { Permit } from '../../src/modules/common/entities/permit.entity';
import { S3Service } from '../../src/modules/tps-permit/s3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Document } from '../../src/modules/tps-permit/entities/document.entity';

describe('TpsPermitService', () => {
  let service: TpsPermitService;
  let s3Service: DeepMocked<S3Service>;
  let tpsRepo: DeepMocked<Repository<TpsPermit>>;
  let permitRepo: DeepMocked<Repository<Permit>>;
  let documentRepo: DeepMocked<Repository<Document>>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    s3Service = createMock<S3Service>();
    tpsRepo = createMock<Repository<TpsPermit>>();
    permitRepo = createMock<Repository<Permit>>();
    documentRepo = createMock<Repository<Document>>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TpsPermitService,
        {
          provide: S3Service,
          useValue: s3Service,
        },
        {
          provide: getRepositoryToken(TpsPermit),
          useValue: tpsRepo,
        },
        {
          provide: getRepositoryToken(Permit),
          useValue: permitRepo,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: documentRepo,
        },
      ],
    }).compile();

    service = module.get<TpsPermitService>(TpsPermitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
