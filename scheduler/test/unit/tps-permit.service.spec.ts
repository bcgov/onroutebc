import { Test, TestingModule } from '@nestjs/testing';
import { TpsPermitService } from '@modules/tps-permit/tps-permit.service';
import { TpsPermit } from '@modules/tps-permit/entities/tps-permit.entity';
import { Permit } from '@modules/common/entities/permit.entity';
import { S3Service } from '@app/modules/common/s3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { DocumentService } from '@modules/common/document.service';

describe('TpsPermitService', () => {
  let service: TpsPermitService;
  let s3Service: DeepMocked<S3Service>;
  let documentService: DeepMocked<DocumentService>;
  let tpsRepo: DeepMocked<Repository<TpsPermit>>;
  let permitRepo: DeepMocked<Repository<Permit>>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    s3Service = createMock<S3Service>();
    documentService = createMock<DocumentService>();
    tpsRepo = createMock<Repository<TpsPermit>>();
    permitRepo = createMock<Repository<Permit>>();
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
          provide: DocumentService,
          useValue: documentService,
        },
      ],
    }).compile();

    service = module.get<TpsPermitService>(TpsPermitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
